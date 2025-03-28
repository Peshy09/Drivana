import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../services/UserService';
import { toast } from 'react-toastify';
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes,
  FaMapMarkerAlt, FaBell, FaShieldAlt, FaHistory, FaCar
} from 'react-icons/fa';
import './styles/Profile.css';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    },
    privacySettings: {
      profileVisibility: 'public',
      activityVisibility: 'friends'
    }
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      
      if (!data || !data.profile) {
        throw new Error('Invalid profile data received');
      }

      setProfileData(data.profile);
      setSavedVehicles(data.savedVehicles || []);
      setTransactions(data.transactions || []);
      setFormData({
        firstName: data.profile.firstName || '',
        lastName: data.profile.lastName || '',
        email: data.profile.email || '',
        phone: data.profile.phoneNumber || '',
        address: data.profile.address || '',
        notificationPreferences: data.profile.notificationPreferences || {
          email: true,
          push: true,
          sms: false
        },
        privacySettings: data.profile.privacySettings || {
          profileVisibility: 'public',
          activityVisibility: 'friends'
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to load profile');
      toast.error(error.message || 'Failed to load profile');
      
      if (error.message === 'Session expired. Please login again.') {
        navigate('/login', { state: { from: '/profile' } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (category, setting, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      await uploadProfilePicture(formData);
      await fetchProfileData();
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateUserProfile(formData);
      setProfileData(updatedProfile);
      updateUser(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="profile-container">
        <div className="error-message">
          {error}
          <button onClick={fetchProfileData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <FaSave /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-main">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-picture-container">
            <img
              src={profileData?.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="profile-picture"
            />
            {isEditing && (
              <div className="profile-picture-upload">
                <label htmlFor="profile-picture" className="upload-button">
                  <FaEdit /> Change Photo
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-group">
              <label><FaUser /> First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{profileData?.firstName}</p>
              )}
            </div>

            <div className="info-group">
              <label><FaUser /> Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{profileData?.lastName}</p>
              )}
            </div>

            <div className="info-group">
              <label><FaEnvelope /> Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{profileData?.email}</p>
              )}
            </div>

            <div className="info-group">
              <label><FaPhone /> Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{profileData?.phoneNumber || 'Not provided'}</p>
              )}
            </div>

            <div className="info-group">
              <label><FaMapMarkerAlt /> Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{profileData?.address || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="content-area">
          {/* Activity Panel */}
          <div className="activity-panel">
            <div className="activity-header">
              <h2><FaHistory /> Recent Activity</h2>
            </div>
            <div className="activity-list">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <FaCar />
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">{transaction.type}</div>
                      <div className="activity-date">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent activity</p>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="settings-panel">
            <h2>Settings & Preferences</h2>
            
            <div className="settings-group">
              <h3><FaBell /> Notification Preferences</h3>
              <div className="toggle-switch">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.email}
                  onChange={(e) => handleSettingsChange('notificationPreferences', 'email', e.target.checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="toggle-switch">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.push}
                  onChange={(e) => handleSettingsChange('notificationPreferences', 'push', e.target.checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="toggle-switch">
                <span>SMS Notifications</span>
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.sms}
                  onChange={(e) => handleSettingsChange('notificationPreferences', 'sms', e.target.checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="settings-group">
              <h3><FaShieldAlt /> Privacy Settings</h3>
              <div className="info-group">
                <label>Profile Visibility</label>
                <select
                  name="profileVisibility"
                  value={formData.privacySettings.profileVisibility}
                  onChange={(e) => handleSettingsChange('privacySettings', 'profileVisibility', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="info-group">
                <label>Activity Visibility</label>
                <select
                  name="activityVisibility"
                  value={formData.privacySettings.activityVisibility}
                  onChange={(e) => handleSettingsChange('privacySettings', 'activityVisibility', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;