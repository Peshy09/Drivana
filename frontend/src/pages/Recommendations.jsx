import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, updatePreferences } from '../services/RecommendationService';
import './styles/Recommendation.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000 },
    brands: [],
    yearRange: { min: 2000, max: new Date().getFullYear() },
    mileageRange: { min: 0, max: 200000 },
    fuelTypes: [],
    transmissionTypes: [],
    engineCapacityRange: { min: 0, max: 6.0 }
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { 
          state: { 
            from: '/recommendations',
            message: 'Please login to view recommendations' 
          } 
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        if (err.message.includes('login')) {
          navigate('/login', { 
            state: { 
              from: '/recommendations',
              message: err.message 
            } 
          });
        } else {
          setError('Failed to load recommendations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const handleFilterChange = async (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    try {
      await updatePreferences(newFilters);
      fetchRecommendations();
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-container">
        <section className="filters-section">
          <h2>Refine Your Recommendations</h2>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Price Range</label>
              <div className="range-inputs">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: parseInt(e.target.value)
                  })}
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: parseInt(e.target.value)
                  })}
                />
              </div>
            </div>
            {/* Add other filter groups similarly */}
          </div>
        </section>

        <section className="recommendations-section">
          <h1>Recommended Vehicles for You</h1>
          <div className="recommendations-grid">
            {recommendations.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">
                <div className="vehicle-image">
                  <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
                </div>
                <div className="vehicle-details">
                  <h3>{vehicle.make} {vehicle.model} {vehicle.year}</h3>
                  <p className="price">${vehicle.price.toLocaleString()}</p>
                  <p className="description">{vehicle.description}</p>
                  <button
                    onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recommendations;