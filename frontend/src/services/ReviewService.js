import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/reviews`;

// Helper function to get auth header
const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getReviews = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_URL}/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch reviews';
    console.error(message, error);
    throw new Error(message);
  }
};

export const getUserReviews = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user reviews';
    console.error(message, error);
    throw new Error(message);
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(API_URL, reviewData, getAuthHeader());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create review';
    console.error(message, error);
    throw new Error(message);
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`${API_URL}/${reviewId}`, reviewData, getAuthHeader());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update review';
    console.error(message, error);
    throw new Error(message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_URL}/${reviewId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete review';
    console.error(message, error);
    throw new Error(message);
  }
};