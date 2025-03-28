import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    getVehicles,
    getVehicleById,
    searchVehicles,
    getVehiclesByCategory,
    getSimilarVehicles,
    createVehicle,
    deleteVehicle,
    getFeaturedVehicles,
    updateVehicle
  } from '../controllers/vehicleController.js';  
import multer from 'multer';
import path from 'path';
import { mkdirSync } from 'fs';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to validate ObjectId
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid vehicle ID format' });
  }
  next();
});

// Configure multer for vehicle images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/vehicles';
        mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && ext) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'));
    }
});

// Public routes
router.get('/', getVehicles);
router.get('/search', searchVehicles);
router.get('/category/:category', getVehiclesByCategory);
router.get('/featured', getFeaturedVehicles);
router.get('/similar/:id', getSimilarVehicles); // Ensure route is included correctly
router.get('/:id', getVehicleById); // Ensure function name is correct

// Protected routes - require authentication
router.use(protect);
router.post('/', upload.array('images', 5), createVehicle);
router.put('/:id', upload.array('images', 5), updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
