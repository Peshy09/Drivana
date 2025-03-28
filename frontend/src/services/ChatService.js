import axios from 'axios';

// Define the base API URL for chat-related requests
const API_URL = `${import.meta.env.VITE_API_URL}/chat`;

// Function to get active chats
export const getActiveChats = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch active chats:', error);
    throw error;
  }
};

// Function to get messages for a chat
export const getMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_URL}/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
};

// Function to send a message
export const sendMessage = async (chatId, message) => {
  try {
    await axios.post(`${API_URL}/${chatId}/send`, { message });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Function to start a video call
export const startVideoCall = async (chatId) => {
  try {
    await axios.post(`${API_URL}/${chatId}/video-call`);
  } catch (error) {
    console.error('Failed to start video call:', error);
    throw error;
  }
};