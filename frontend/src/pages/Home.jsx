import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/Home.css';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  // Assuming you have a function to get the token from local storage or context
  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="navbar">
          <div className="logo">
            <h1>Drivana Cars</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="nav-login">Login</Link></li>
            <li><Link to="/register" className="nav-register">Register</Link></li>
          </ul>
        </nav>
        <div className="hero-section">
          <div className="hero-content">
            <h1>Find Your Dream Car Today</h1>
            <p>Experience the future of car buying with our premium selection and seamless process</p>
            <div className="cta-buttons">
              <Link to="/inventory" className="cta-button primary">Explore Cars</Link>
              <Link to="/register" className="cta-button secondary">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="introduction-section">
        <div className="section-container">
          <h2>Why Choose Drivana Cars?</h2>
          <p className="section-subtitle">Your trusted partner in finding the perfect vehicle</p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">🚗</div>
              <h3>Verified Vehicles</h3>
              <p>Every car undergoes thorough inspection and verification</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Best Pricing</h3>
              <p>Competitive prices with transparent financing options</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h3>Smart Search</h3>
              <p>AI-powered recommendations based on your preferences</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Expert Support</h3>
              <p>Dedicated team to assist you throughout the process</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-vehicles">
        <div className="section-container">
          <h2>Featured Vehicles</h2>
          <p className="section-subtitle">Discover our premium selection</p>
          <div className="vehicle-cards">
            <div className="vehicle-card">
              <div className="card-badge">Featured</div>
              <img src="./images/ford.jpg" alt="Ford Endeavour" />
              <div className="vehicle-details">
                <h3>Ford Endeavour</h3>
                <div className="vehicle-specs">
                  <span>25,000 miles</span>
                  <span>Automatic</span>
                  <span>Petrol</span>
                </div>
                <div className="vehicle-price">
                  <h4>$15,000</h4>
                  <Link to="/vehicle-details" className="view-details-button">View Details</Link>
                </div>
              </div>
            </div>
            <div className="vehicle-card">
              <div className="card-badge">Featured</div>
              <img src="./images/jaguar.jpg" alt="Jaguar F-Pace" />
              <div className="vehicle-details">
                <h3>Jaguar F-Pace</h3>
                <div className="vehicle-specs">
                  <span>25,000 miles</span>
                  <span>Automatic</span>
                  <span>Petrol</span>
                </div>
                <div className="vehicle-price">
                  <h4>$15,000</h4>
                  <Link to="/vehicle-details" className="view-details-button">View Details</Link>
                </div>
              </div>
            </div>
            <div className="vehicle-card">
              <div className="card-badge">Featured</div>
              <img src="./images/bmw.jpg" alt="BMW M5" />
              <div className="vehicle-details">
                <h3>BMW M5</h3>
                <div className="vehicle-specs">
                  <span>25,000 miles</span>
                  <span>Automatic</span>
                  <span>Petrol</span>
                </div>
                <div className="vehicle-price">
                  <h4>$15,000</h4>
                  <Link to="/vehicle-details" className="view-details-button">View Details</Link>
                </div>
              </div>
            </div>
          </div>
          <Link to="/inventory" className="see-all-button">View All Vehicles</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;