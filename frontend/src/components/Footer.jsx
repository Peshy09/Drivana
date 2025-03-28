import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} 2025 Drivana Cars. All rights reserved.</p>
        <p>Contact us: info@drivanacars.com</p>
        <p>Follow us on social media</p>
        <p>
          <a href="#" className="footer-link">Privacy Policy</a> |{' '}
          <a href="#" className="footer-link">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;