import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
};

// Register new user
export const registerUser = async (userData) => {
    try {
        // Validate required fields
        const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
        for (const field of requiredFields) {
            if (!userData[field]?.trim()) {
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Validate password length
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        const response = await axios.post(`${API_URL}/register`, userData);
        
        // If registration is successful, automatically set the token
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle specific server errors
            const errorMessage = error.response.data.message || error.response.data.error || 'Registration failed';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

// Login user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        
        // The server returns the token directly in the user object
        const userData = response.data;
        const token = userData.token;

        if (!token) {
            throw new Error('No token received from server');
        }

        // Save token to localStorage
        localStorage.setItem('token', token);

        // Remove token from user data
        const { token: _, ...userWithoutToken } = userData;
        
        return {
            user: userWithoutToken,
            token
        };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Login failed');
        }
        throw error;
    }
};

// Get user profile data
export const getUserProfile = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/profile`, { headers });
        
        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        // Get saved vehicles and transactions
        let savedVehicles = [];
        let transactions = [];
        try {
            const [vehiclesRes, transactionsRes] = await Promise.all([
                axios.get(`${API_URL}/saved-vehicles`, { headers }),
                axios.get(`${API_URL}/transactions`, { headers })
            ]);
            savedVehicles = vehiclesRes.data || [];
            transactions = transactionsRes.data || [];
        } catch (error) {
            console.warn('Failed to fetch additional profile data:', error);
        }

        return {
            profile: response.data,
            savedVehicles,
            transactions
        };
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message || 'Failed to fetch profile';
    }
};

// Update user profile
export const updateUserProfile = async (userData) => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.put(`${API_URL}/profile`, userData, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Upload profile picture
export const uploadProfilePicture = async (formData) => {
    try {
        const headers = {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        };
        const response = await axios.post(`${API_URL}/profile/picture`, formData, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Get saved vehicles
export const getSavedVehicles = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/saved-vehicles`, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Get transaction history
export const getTransactionHistory = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/transactions`, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Save vehicle to favorites
export const saveVehicle = async (vehicleId) => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.post(`${API_URL}/saved-vehicles`, { vehicleId }, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Remove vehicle from favorites
export const removeSavedVehicle = async (vehicleId) => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.delete(`${API_URL}/saved-vehicles/${vehicleId}`, { headers });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        throw error.response?.data?.message || error.message;
    }
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    getSavedVehicles,
    getTransactionHistory,
    saveVehicle,
    removeSavedVehicle
};