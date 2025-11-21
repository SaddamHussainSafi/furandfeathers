import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import SectionHero from '../components/SectionHero';
import api from '../utils/api';
import { getUserInitials } from '../utils/userDisplay';
import '../styles/forms.css';
import '../styles/profile.css';

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    // Shelter-specific fields
    shelterName: '',
    website: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [avatarStatus, setAvatarStatus] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleSave = () => {
    // Save profile data
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('picture', file);
    setUploadingAvatar(true);
    setAvatarStatus(null);
    try {
      await api.post('/users/me/picture', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      setAvatarStatus({ type: 'success', text: 'Profile photo updated' });
    } catch (error) {
      console.error('Failed to upload avatar', error);
      setAvatarStatus({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to update photo. Try again.'
      });
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const isShelter = user?.role === 'shelter';

  return (
    <div className="page profile-page">
      <SectionHero
        title={isShelter ? 'Shelter Settings' : 'My Profile'}
        subtitle={isShelter ? 'Update your shelter details and preferences.' : 'Manage your personal information.'}
      />

      <section className="page-section">
        <div className="profile-avatar-uploader">
          <div className="profile-avatar-preview">
            {user?.picture ? (
              <img src={user.picture} alt={user.name || 'Profile avatar'} referrerPolicy="no-referrer" />
            ) : (
              <span>{getUserInitials(user?.name) || (user?.email?.[0] || 'F').toUpperCase()}</span>
            )}
          </div>
          <div className="profile-avatar-actions">
            <strong>Profile photo</strong>
            <p>Personalize chats, messages, and dashboards with your photo.</p>
            <label className="site-button site-button--secondary profile-avatar-upload-button">
              {uploadingAvatar ? 'Uploading...' : 'Update photo'}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
            </label>
            {avatarStatus && (
              <small className={`profile-avatar-status profile-avatar-status--${avatarStatus.type}`}>
                {avatarStatus.text}
              </small>
            )}
          </div>
        </div>

        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Profile Information</h2>
          <button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className={`site-button ${isEditing ? 'site-button--primary' : 'site-button--secondary'}`}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="form-fields">
          {/* Basic Info */}
          <label className="form-group">
            <span>Name</span>
            {isEditing ? (
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            ) : (
              <p className="profile-field-display">{formData.name}</p>
            )}
          </label>

          <label className="form-group">
            <span>Email</span>
            {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            ) : (
              <p className="profile-field-display">{formData.email}</p>
            )}
          </label>

          <label className="form-group">
            <span>Phone</span>
            {isEditing ? (
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            ) : (
              <p className="profile-field-display">{formData.phone || 'Not provided'}</p>
            )}
          </label>

          {/* Shelter-specific fields */}
          {isShelter && (
            <>
              <div className="profile-field-group">
                <label htmlFor="shelterName">Shelter Name</label>
                {isEditing ? (
                  <input
                    id="shelterName"
                    type="text"
                    name="shelterName"
                    value={formData.shelterName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{formData.shelterName || 'Not set'}</p>
                )}
              </div>

              <div className="profile-field-group">
                <label htmlFor="shelterWebsite">Website</label>
                {isEditing ? (
                  <input
                    id="shelterWebsite"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{formData.website || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field-group">
                <label htmlFor="shelterDescription">Description</label>
                {isEditing ? (
                  <textarea
                    id="shelterDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                ) : (
                  <p>{formData.description || 'No description provided'}</p>
                )}
              </div>
            </>
          )}

          {/* Adopter-specific fields */}
          {!isShelter && (
            <>
              <div className="profile-field-group">
                <label htmlFor="profileAddress">Address</label>
                {isEditing ? (
                  <textarea
                    id="profileAddress"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                ) : (
                  <p>{formData.address || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field-group">
                <label htmlFor="profileBio">Bio</label>
                {isEditing ? (
                  <textarea
                    id="profileBio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself and what kind of pet you're looking for..."
                  />
                ) : (
                  <p>{formData.bio || 'No bio provided'}</p>
                )}
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <div className="form-actions">
            <button onClick={() => setIsEditing(false)} type="button" className="site-button site-button--secondary">Cancel</button>
          </div>
        )}
      </section>
    </div>
  );
}

