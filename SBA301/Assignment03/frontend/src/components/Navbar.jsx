import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, isCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span>🏨</span>
          <span>FUMiniHotel</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>Explore Rooms</Link>
          </li>

          {/* Customer Specific Links */}
          {isAuthenticated && isCustomer && (
            <>
              <li>
                <Link to="/my-bookings" className={isActive('/my-bookings')}>My Bookings</Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')}>Profile</Link>
              </li>
            </>
          )}

          {/* Staff Specific Links */}
          {isAuthenticated && isStaff && (
            <>
              <li>
                <Link to="/staff/rooms" className={isActive('/staff/rooms')}>Manage Rooms</Link>
              </li>
              <li>
                <Link to="/staff/customers" className={isActive('/staff/customers')}>Manage Customers</Link>
              </li>
              <li>
                <Link to="/staff/bookings" className={isActive('/staff/bookings')}>Manage Bookings</Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span className={`badge ${isStaff ? 'badge-staff' : 'badge-customer'}`}>
                {isStaff ? 'STAFF' : 'CUSTOMER'}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {user.fullName || user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

