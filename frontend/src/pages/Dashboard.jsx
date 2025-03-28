import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { 
  FaHome, 
  FaCar, 
  FaDollarSign, 
  FaComments, 
  FaHistory, 
  FaStar, 
  FaLightbulb,
  FaUser,
  FaSignOutAlt 
} from 'react-icons/fa';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, token, logout } = useContext(UserContext);

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Drivana</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <FaHome /> <span>Dashboard</span>
          </Link>
          <Link to="/vehicle-list" className="nav-item">
            <FaCar /> <span>Vehicles</span>
          </Link>
          <Link to="/payment" className="nav-item">
            <FaDollarSign /> <span>Payment</span>
          </Link>
          <Link to="/chat" className="nav-item">
            <FaComments /> <span>Chat</span>
          </Link>
          <Link to="/transactions" className="nav-item">
            <FaHistory /> <span>Transactions</span>
          </Link>
          <Link to="/reviews" className="nav-item">
            <FaStar /> <span>Reviews</span>
          </Link>
          <Link to="/recommendations" className="nav-item">
            <FaLightbulb /> <span>Recommendations</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <FaUser /> <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome Back, {user?.firstName || 'User'}!</h1>
            <div className="user-profile">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Recent Transactions</h3>
            <p>View your latest vehicle transactions</p>
            <Link to="/transactions" className="card-link">View All</Link>
          </div>
          <div className="dashboard-card">
            <h3>Available Vehicles</h3>
            <p>Check our vehicle collection</p>
            <Link to="/vehicles" className="card-link">View All</Link>
          </div>
          <div className="dashboard-card">
            <h3>Payment Status</h3>
            <p>Manage your payments</p>
            <Link to="/payment" className="card-link">View Details</Link>
          </div>
          <div className="dashboard-card">
            <h3>Recommendations</h3>
            <p>Personalized vehicle suggestions</p>
            <Link to="/recommendations" className="card-link">View All</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
