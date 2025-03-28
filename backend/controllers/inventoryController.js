import Inventory from '../models/Inventory.js';

export const createInventory = async (req, res) => {
  try {
    const { vehicleId, quantity } = req.body;
    const inventory = new Inventory({ vehicleId, quantity });
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    console.error('Failed to create inventory:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getInventoryByVehicle = async (req, res) => {
  try {
    const inventory = await Inventory.find({ vehicleId: req.params.vehicleId });
    res.json(inventory);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};