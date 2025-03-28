import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    getNotifications,
    markAsRead,
    updateNotificationPreferences,
    deleteNotification,
    getUnreadCount
} from '../controllers/notificationController.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Get user's notifications (uses req.user.id from auth middleware)
router.get('/', getNotifications);

// Get unread notification count
router.get('/unread/count', getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Update notification preferences
router.put('/preferences', updateNotificationPreferences);

// Delete notification
router.delete('/:notificationId', deleteNotification);

export default router;