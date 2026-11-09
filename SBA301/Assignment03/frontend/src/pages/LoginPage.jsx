import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'ROLE_STAFF') {
        navigate('/staff/rooms');
      } else {
        navigate('/');
      }
    } else {
      setError(res.error);
    }
  };

  // Quick fill helper for testing / grading
  const fillCredentials = (type) => {
    if (type === 'staff') {
      setEmail('staff@fuminihotel.com');
      setPassword('Staff@123');
    } else {
      setEmail('customer@gmail.com');
      setPassword('123456');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sign in to manage your hotel bookings or administration
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo fill credentials box */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Quick Demo Accounts:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillCredentials('staff')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Staff (Admin)
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('customer')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Customer
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

