import React, { useState, useEffect } from 'react';
import { customerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CustomerProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getProfile();
      setProfile({
        customerFullName: res.data.customerFullName || '',
        telephone: res.data.telephone || '',
        emailAddress: res.data.emailAddress || '',
        customerBirthday: res.data.customerBirthday || '',
        password: '',
      });
    } catch (err) {
      setError('Could not load profile. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        customerFullName: profile.customerFullName,
        telephone: profile.telephone,
        emailAddress: profile.emailAddress,
        customerBirthday: profile.customerBirthday,
      };
      if (profile.password && profile.password.trim()) {
        updateData.password = profile.password.trim();
      }

      const res = await customerApi.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      // Update Auth context full name
      if (user) {
        const updatedUser = { ...user, fullName: res.data.customerFullName };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setProfile((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          My Profile
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Manage your contact details and account security
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control"
              value={profile.emailAddress}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="customerFullName"
              className="form-control"
              required
              value={profile.customerFullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input
              type="tel"
              name="telephone"
              className="form-control"
              required
              value={profile.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Birthday</label>
            <input
              type="date"
              name="customerBirthday"
              className="form-control"
              required
              value={profile.customerBirthday}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <label className="form-label">New Password (leave empty to keep current password)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter new password (optional)"
              value={profile.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.65rem' }}
          >
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;

