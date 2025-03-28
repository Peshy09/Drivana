import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/recommendations`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please login to view recommendations');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getRecommendations = async () => {
  try {
    // Check auth before making request
    const headers = getAuthHeader();
    const response = await axios.get(`${API_URL}/recommendations`, headers);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.message.includes('login')) {
      // Clear invalid token
      localStorage.removeItem('token');
      throw new Error('Please login to view recommendations');
    }
    console.error('Error fetching recommendations:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePreferences = async (preferences) => {
  try {
    // Check auth before making request
    const headers = getAuthHeader();
    const response = await axios.put(
      `${API_URL}/recommendations/preferences`,
      preferences,
      headers
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.message.includes('login')) {
      // Clear invalid token
      localStorage.removeItem('token');
      throw new Error('Please login to update preferences');
    }
    console.error('Error updating preferences:', error.response?.data || error.message);
    throw error;
  }
};
  