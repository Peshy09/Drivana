import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { getReviews, createReview, deleteReview } from '../services/ReviewService';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import './styles/Review.css';

const Review = () => {
  const { user } = useContext(UserContext);
  const { vehicleId, dealershipId } = useParams();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    vehicleId,
    dealershipId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleId) {
      fetchReviews();
    }
  }, [vehicleId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getReviews(vehicleId);
      setReviews(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!vehicleId) {
      setError('Vehicle ID is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await createReview(newReview);
      setNewReview({ ...newReview, rating: 5, comment: '' });
      await fetchReviews();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        setError('');
        await deleteReview(reviewId);
        await fetchReviews();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star-filled' : 'star-empty'}
        onClick={() => !loading && setNewReview({ ...newReview, rating: index + 1 })}
      />
    ));
  };

  if (!vehicleId) {
    return <div className="error-message">Vehicle ID is required to view reviews.</div>;
  }

  return (
    <div className={`review-container ${isDashboard ? 'dashboard-view' : ''}`}>
      <main className="review-main">
        {user && (
          <section className="review-form-section">
            <h2>Leave a Review</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-container">
                <label>Rating:</label>
                <div className="stars">{renderStars(newReview.rating)}</div>
              </div>
              <div className="form-group">
                <label htmlFor="comment">Your Review:</label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Write your review here..."
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </section>
        )}

        <section className="reviews-list-section">
          <h2>Customer Reviews</h2>
          {loading && <div className="loading">Loading reviews...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && reviews.length > 0 ? (
            <ul className="review-list">
              {reviews.map((review) => (
                <li key={review._id} className="review-item">
                  <div className="review-header">
                    {review.customerPhoto ? (
                      <img src={review.customerPhoto} alt="Customer" className="customer-photo" />
                    ) : (
                      <FaUserCircle className="default-user-icon" />
                    )}
                    <div className="review-meta">
                      <h3>{review.userId.username}</h3>
                      <div className="stars">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.comment}</p>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user && user.id === review.userId._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="delete-button"
                      disabled={loading}
                    >
                      Delete Review
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            !loading && !error && <p className="no-reviews">No reviews found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Review;