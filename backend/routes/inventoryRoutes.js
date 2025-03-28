import express from 'express';
import { createInventory, getInventoryByVehicle } from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/', createInventory);
router.get('/vehicle/:vehicleId', getInventoryByVehicle);

export default router;