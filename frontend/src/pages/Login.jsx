import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Add this line to debug
    console.log('Sending login data:', formData);

    try {
      const userData = await login(formData);
      
      // Show success message
      toast.success('Login successful!');
      
      // Small delay to ensure the user sees the success message
      setTimeout(() => {
        // Get the redirect path from location state or default to dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }, 500);

    } catch (err) {
      console.error('Login error:', err);
      
      const errorCode = err.response?.data?.code;
      const errorMessage = err.response?.data?.message || err.message;

      // Handle specific error codes
      switch (errorCode) {
        case 'MISSING_CREDENTIALS':
          toast.error('Please enter both email and password');
          break;
        case 'INVALID_CREDENTIALS':
          toast.error('Invalid email or password');
          setFormData(prev => ({ ...prev, password: '' }));
          break;
        case 'SERVER_ERROR':
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (!navigator.onLine) {
            toast.error('No internet connection. Please check your network.');
          } else {
            toast.error(errorMessage || 'Failed to login. Please try again.');
          }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="login-card">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;