import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import RoomsPage from './pages/RoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CustomerBookingsPage from './pages/CustomerBookingsPage';
import StaffRoomsPage from './pages/StaffRoomsPage';
import StaffCustomersPage from './pages/StaffCustomersPage';
import StaffBookingsPage from './pages/StaffBookingsPage';

// Route Guard for Staff
const StaffRoute = ({ children }) => {
  const { isAuthenticated, isStaff } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/" replace />;
  return children;
};

// Route Guard for Customer
const CustomerRoute = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isCustomer) return <Navigate to="/" replace />;
  return children;
};

// Route Guard for Logged In User
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RoomsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer Routes */}
              <Route
                path="/profile"
                element={
                  <AuthenticatedRoute>
                    <CustomerProfilePage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <CustomerRoute>
                    <CustomerBookingsPage />
                  </CustomerRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/rooms"
                element={
                  <StaffRoute>
                    <StaffRoomsPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/customers"
                element={
                  <StaffRoute>
                    <StaffCustomersPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/bookings"
                element={
                  <StaffRoute>
                    <StaffBookingsPage />
                  </StaffRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

