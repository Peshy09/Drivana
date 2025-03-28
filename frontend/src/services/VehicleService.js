import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/vehicles`;

// Use the same axios instance as UserContext
axios.defaults.withCredentials = true;

// Add request interceptor to handle navigation
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getVehicles = async (params) => {
  try {
    // Format array parameters for the API
    const formattedParams = {
      ...params,
      priceRange: params.priceRange?.join(','),
      year: params.year?.join(','),
      mileage: params.mileage?.join(','),
      engineCapacity: params.engineCapacity?.join(','),
      brand: params.brand?.join(','),
      fuelType: params.fuelType?.join(','),
      transmission: params.transmission?.join(','),
    };

    // Remove empty array parameters and empty search term
    Object.keys(formattedParams).forEach(key => {
      if (Array.isArray(formattedParams[key]) && formattedParams[key].length === 0) {
        delete formattedParams[key];
      }
      if (key === 'searchTerm' && (!formattedParams[key] || formattedParams[key].trim() === '')) {
        delete formattedParams[key];
      }
    });

    // Ensure page and limit are numbers
    formattedParams.page = Number(formattedParams.page) || 1;
    formattedParams.limit = Number(formattedParams.limit) || 12;

    console.log('Fetching vehicles with params:', formattedParams);
    const response = await axios.get(API_URL, { params: formattedParams });
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const getVehicleDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    throw error;
  }
};

export const getSimilarVehicles = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/similar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar vehicles:', error);
    throw error;
  }
};