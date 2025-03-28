import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Transaction from '../models/Transaction.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    // Ensure upload directory exists
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Generate JWT Token Function
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Validate user session
export const validateSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        valid: false, 
        message: 'Invalid session',
        code: 'INVALID_SESSION'
      });
    }

    // Get user with populated data
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedVehicles')
      .populate('transactionHistory');

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    res.json({ 
      valid: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(401).json({ 
      valid: false, 
      message: 'Session validation failed',
      code: 'SESSION_VALIDATION_FAILED'
    });
  }
};

// Handle user logout
export const logout = async (req, res) => {
  try {
    // Update last active timestamp
    await User.findByIdAndUpdate(req.user._id, {
      lastActive: new Date()
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create user with all fields
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false
      },
      privacySettings: {
        profileVisibility: 'public',
        activityVisibility: 'friends'
      }
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        ...user.getPublicProfile(),
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const user = await User.findOne({ email })
      .populate('savedVehicles')
      .populate('transactionHistory');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const validPassword = await user.matchPassword
    ? await user.matchPassword(password)
    : await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      ...user.getPublicProfile(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      code: 'SERVER_ERROR'
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedVehicles')
      .populate({
        path: 'transactionHistory',
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update basic information
    const {
      firstName, lastName, email, phoneNumber,
      address, notificationPreferences, privacySettings,
      password
    } = req.body;

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email && email !== user.email) {
      // Check if email is already in use
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (notificationPreferences) user.notificationPreferences = notificationPreferences;
    if (privacySettings) user.privacySettings = privacySettings;
    if (password) {
      user.password = password; // Will be hashed by pre-save middleware
    }

    // Update last active timestamp
    user.lastActive = new Date();

    const updatedUser = await user.save();
    res.json(updatedUser.getPublicProfile());
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
      try {
        await fs.unlink(oldPicturePath);
      } catch (err) {
        console.warn('Failed to delete old profile picture:', err);
      }
    }

    // Update profile picture path
    const relativePath = path.relative(path.join(__dirname, '..'), req.file.path);
    user.profilePicture = relativePath.replace(/\\/g, '/');
    
    // Update last active timestamp
    user.lastActive = new Date();
    
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};

// Get saved vehicles
export const getSavedVehicles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedVehicles');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedVehicles);
  } catch (error) {
    console.error('Saved vehicles fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch saved vehicles' });
  }
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user._id)
      .populate({
        path: 'transactionHistory',
        options: {
          sort: { createdAt: -1 },
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total count for pagination
    const total = await Transaction.countDocuments({ _id: { $in: user.transactionHistory } });

    res.json({
      transactions: user.transactionHistory,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Transaction history fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
};

// Get all users (Admin route)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};