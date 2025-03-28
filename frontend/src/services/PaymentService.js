import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/payments`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const createPaymentIntent = async (vehicleId) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-payment-intent`,
      { vehicleId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(error.response?.data?.message || 'Failed to create payment');
  }
};

export const confirmPaymentSuccess = async (paymentIntentId, transactionId) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment-success`,
      { paymentIntentId, transactionId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error(error.response?.data?.message || 'Failed to confirm payment');
  }
};

export const getPaymentStatus = async (transactionId) => {
  try {
    const response = await axios.get(
      `${API_URL}/status/${transactionId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw new Error(error.response?.data?.message || 'Failed to get payment status');
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/verify/${paymentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Verification failed');
  }
};