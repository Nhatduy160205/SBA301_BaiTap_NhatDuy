import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api';

const CustomerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getMyHistory();
      setBookings(res.data);
    } catch (err) {
      setError('Could not load booking history. Please make sure you are signed in.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge badge-confirmed">Confirmed</span>;
      case 2:
        return <span className="badge badge-completed">Completed</span>;
      case 0:
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge badge-secondary">Status {status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            My Booking History
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            View all your past and upcoming hotel reservations
          </p>
        </div>
        <Link to="/" className="btn btn-primary">
          + Book More Rooms
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading your reservations...
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#334155', marginBottom: '0.5rem' }}>
            You have no booking reservations yet.
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Ready for your next stay? Explore our available rooms today.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Rooms
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => (
            <div key={booking.bookingReservationID} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                      Reservation #{booking.bookingReservationID}
                    </h3>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                    Booked on: <strong>{booking.bookingDate}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Total Paid:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>
                    ${Number(booking.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Booked Rooms Table */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rooms Included ({booking.bookingDetails?.length || 0})
                </h4>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Room Number</th>
                        <th>Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Subtotal Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.bookingDetails?.map((detail, idx) => (
                        <tr key={idx}>
                          <td><strong>Room {detail.roomNumber}</strong></td>
                          <td>{detail.roomTypeName || 'Standard'}</td>
                          <td>{detail.startDate}</td>
                          <td>{detail.endDate}</td>
                          <td><strong style={{ color: '#16a34a' }}>${Number(detail.actualPrice).toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookingsPage;

