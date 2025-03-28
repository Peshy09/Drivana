import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

// Configure axios defaults
axios.defaults.withCredentials = true;

// Axios response interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/refresh-token`);
        const newToken = response.data.token;
        
        if (newToken) {
          localStorage.setItem('token', newToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Only clear auth and redirect on refresh failure or specific error codes
        const errorCode = error.response?.data?.code;
        if (['TOKEN_EXPIRED', 'INVALID_TOKEN', 'USER_NOT_FOUND'].includes(errorCode)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  // Initialize axios headers with token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Validate session on mount and token change
  useEffect(() => {
    const validateSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Ensure headers are set
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        const response = await axios.get(`${API_URL}/validate-session`);
        if (response.data.valid && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // Try to refresh the token before giving up
          try {
            const refreshResponse = await axios.post(`${API_URL}/refresh-token`);
            if (refreshResponse.data.token) {
              setAuthToken(refreshResponse.data.token);
              setUser(refreshResponse.data.user);
              localStorage.setItem('user', JSON.stringify(refreshResponse.data.user));
              return;
            }
          } catch (refreshError) {
            throw new Error('Session refresh failed');
          }
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        if (error.response?.status === 401) {
          setAuthToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [setAuthToken]);

  const handleLogin = async (credentials) => {
    try {
      setAuthToken(null); // Clear any existing token
      
      const response = await axios.post(`${API_URL}/login`, credentials);
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server');
      }

      setAuthToken(userData.token);
      const { token: _, ...userWithoutToken } = userData;
      setUser(userWithoutToken);
      localStorage.setItem('user', JSON.stringify(userWithoutToken));

      return userWithoutToken;
    } catch (error) {
      setAuthToken(null);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      window.location.href = '/login';
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, updatedData);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to update profile';
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await axios.post(`${API_URL}/profile/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data.profilePicture;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to upload profile picture';
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    updateProfile,
    uploadProfilePicture,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };