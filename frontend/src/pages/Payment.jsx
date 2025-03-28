import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPaymentIntent } from '../services/PaymentService';
import './styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('makePayment'); // Toggle between "Make a Payment" and "Payment History"
  const [transactionAmount, setTransactionAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Get vehicle details from location state or use default values
  const vehicle = location.state?.vehicle || {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 25000
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!transactionAmount || !phoneNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await createPaymentIntent({
        amount: transactionAmount,
        paymentMethod: 'Mpesa',
        vehicleId: vehicle.id,
        phoneNumber
      });

      if (response.success) {
        navigate('/payment-success', {
          state: {
            transactionId: response.transactionId,
            amount: transactionAmount
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    // Fetch payment history from the backend (mocked for now)
    const mockHistory = [
      { id: '1', date: '2025-03-15', amount: 25000, status: 'Completed' },
      { id: '2', date: '2025-03-14', amount: 15000, status: 'Pending' }
    ];
    setPaymentHistory(mockHistory);
  };

  useEffect(() => {
    if (activeTab === 'paymentHistory') {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <h1>Payments</h1>
          <div className="tab-navigation">
            <button
              className={activeTab === 'makePayment' ? 'active' : ''}
              onClick={() => setActiveTab('makePayment')}
            >
              Make a Payment
            </button>
            <button
              className={activeTab === 'paymentHistory' ? 'active' : ''}
              onClick={() => setActiveTab('paymentHistory')}
            >
              Payment History
            </button>
          </div>
        </div>

        {activeTab === 'makePayment' && (
          <div className="payment-main">
            <div className="payment-form-section">
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="transactionAmount">Transaction Amount (KES)</label>
                  <input
                    type="number"
                    id="transactionAmount"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Mpesa Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="07XXXXXXXX"
                    className="form-control"
                    maxLength="10"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  type="submit"
                  className="pay-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay KES ${transactionAmount || vehicle.price}`}
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="vehicle-details">
                <div className="detail-row">
                  <span>Make:</span>
                  <span>{vehicle.make}</span>
                </div>
                <div className="detail-row">
                  <span>Model:</span>
                  <span>{vehicle.model}</span>
                </div>
                <div className="detail-row">
                  <span>Year:</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="detail-row total">
                  <span>Total Amount:</span>
                  <span>KES {vehicle.price}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'paymentHistory' && (
          <div className="payment-history">
            <h2>Payment History</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount (KES)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;