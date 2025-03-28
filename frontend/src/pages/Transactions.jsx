import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '../services/TransactionService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (err) {
        setError(err.message || 'Failed to load transactions');
        toast.error(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="transactions-page">
        <div className="transactions-loading">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <div className="page-header">
          <h1>Transaction History</h1>
          <p className="transaction-count">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {error ? (
          <div className="transactions-error">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        ) : transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="transaction-card">
                <div className="transaction-image">
                  {transaction.vehicleId?.imageUrl ? (
                    <img 
                      src={transaction.vehicleId.imageUrl} 
                      alt={`${transaction.vehicleId.make} ${transaction.vehicleId.model}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-car.png';
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="transaction-content">
                  <div className="transaction-header">
                    <div className="vehicle-info">
                      <h3>
                        {transaction.vehicleId ? 
                          `${transaction.vehicleId.make} ${transaction.vehicleId.model} ${transaction.vehicleId.year}` :
                          'Vehicle Unavailable'
                        }
                      </h3>
                      <span className={`status ${transaction.status?.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="transaction-id">
                      ID: {transaction.transactionId}
                    </div>
                  </div>

                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(transaction.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <span className="value">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Payment Method:</span>
                      <span className="value">{transaction.paymentMethod}</span>
                    </div>
                    {transaction.vehicleId?.price && (
                      <div className="detail-row">
                        <span className="label">Vehicle Price:</span>
                        <span className="value">{formatCurrency(transaction.vehicleId.price)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-transactions">
            <div className="empty-state">
              <img src="/empty-transactions.svg" alt="No transactions" />
              <h3>No Transactions Found</h3>
              <p>You haven't made any transactions yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;