import Notification from '../models/Notification.js';
import User from '../models/User.js'; // Assuming User model is defined in this file

export const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({ userId, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to most recent 50 notifications
    res.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or unauthorized' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, smsNotifications } = req.body;
    
    // Update user preferences in User model
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        notificationPreferences: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser.notificationPreferences);
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or unauthorized' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Failed to get unread notification count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};