import Chat from '../models/Chat.js';

export const getActiveChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).populate('sellerId', 'username');
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate('messages.sender', 'username');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = {
      text: message,
      sender: req.user._id,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message;
    await chat.save();

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const startVideoCall = async (req, res) => {
  try {
    // Logic to start a video call
    res.json({ message: 'Video call started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};