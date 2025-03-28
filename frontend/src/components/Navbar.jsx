import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCar, 
  FaUser,
  FaBell,
  FaSignOutAlt 
} from 'react-icons/fa';
import './styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Drivana</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/vehicles" className={location.pathname === '/vehicles' ? 'active' : ''}>
          <FaCar /> Vehicles
        </Link>
        <Link to="/notifications" className={location.pathname === '/notifications' ? 'active' : ''}>
          <FaBell /> Notifications
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          <FaUser /> Profile
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
