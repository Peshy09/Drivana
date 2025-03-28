import express from 'express';
import { getActiveChats, getMessages, sendMessage, startVideoCall } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get active chats
router.get('/active', getActiveChats);

// Get messages for a chat
router.get('/:chatId/messages', getMessages);

// Send a message
router.post('/:chatId/send', sendMessage);

// Start a video call
router.post('/:chatId/video-call', startVideoCall);

export default router;