import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getTransactionHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}`, getAuthHeader());
    return response.data.transactions || []; // Return empty array if no transactions
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to view transactions');
    }
    console.error('Error fetching transaction history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch transaction history');
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post(`${API_URL}`, transactionData, getAuthHeader());
    return response.data.transaction;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to create a transaction');
    }
    if (error.response?.data?.code === 'MISSING_FIELDS') {
      throw new Error('Please provide all required transaction details');
    }
    console.error('Error creating transaction:', error);
    throw new Error(error.response?.data?.message || 'Failed to create transaction');
  }
};