import Vehicle from '../models/Vehicle.js';
import mongoose from 'mongoose';

export const getVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const vehicles = await Vehicle.find()
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Vehicle.countDocuments();

    res.json({ vehicles, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Fetching vehicle with ID:", id); // Debugging the ID

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      console.log("Vehicle not found in the database."); // Log if vehicle is not found
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    console.log("Vehicle found:", vehicle); // Log the found vehicle
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchVehicles = async (req, res) => {
  try {
    const { query } = req.query;
    const vehicles = await Vehicle.find({
      $or: [
        { make: { $regex: new RegExp(query, 'i') } },
        { model: { $regex: new RegExp(query, 'i') } },
        { category: { $regex: new RegExp(query, 'i') } }
      ]
    }).limit(10); // ✅ Fixed misplaced limit
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehiclesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const vehicles = await Vehicle.find({ category }).limit(10);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSimilarVehicles = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    const similarVehicles = await Vehicle.find({
      category: vehicle.category,
      _id: { $ne: vehicle._id },
    }).limit(5);

    res.json({ success: true, data: similarVehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Added missing functions
export const createVehicle = async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fixed missing function
export const getFeaturedVehicles = async (req, res) => {
  try {
    const featuredVehicles = await Vehicle.find({ isFeatured: true }).limit(10);
    res.json(featuredVehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    // Check if vehicle exists
    const existingVehicle = await Vehicle.findById(id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Update fields
    const updatedData = { ...req.body };
    if (req.files) {
      updatedData.images = req.files.map(file => file.path); // Assuming images are uploaded
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

