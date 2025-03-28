import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AutoMarket</h2>
      </div>
      <div className="sidebar-menu">
        <button onClick={() => navigate('/dashboard/vehicle-list')}>
          <i className="fas fa-car"></i>
          Vehicle List
        </button>
        <button onClick={() => navigate('/dashboard/vehicle-detail')}>
          <i className="fas fa-info-circle"></i>
          Vehicle Details
        </button>
        <button onClick={() => navigate('/dashboard/transactions')}>
          <i className="fas fa-exchange-alt"></i>
          Transactions
        </button>
        <button onClick={() => navigate('/dashboard/reviews')}>
          <i className="fas fa-star"></i>
          Reviews
        </button>
        <button onClick={() => navigate('/dashboard/recommendations')}>
          <i className="fas fa-thumbs-up"></i>
          Recommendations
        </button>
        <button onClick={() => navigate('/dashboard/chat')}>
          <i className="fas fa-comments"></i>
          Chat
        </button>
        <button onClick={() => navigate('/dashboard/profile')}>
          <i className="fas fa-user"></i>
          Profile
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 