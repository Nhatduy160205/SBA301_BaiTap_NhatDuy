import React, { useState, useEffect } from 'react';
import { bookingApi } from '../services/api';

const StaffBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAll();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (statusFilter !== '') params.status = statusFilter;
      const res = await bookingApi.search(params);
      setBookings(res.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await bookingApi.updateStatus(id, newStatus);
      setSuccess(`Booking #${id} status updated to ${getStatusLabel(newStatus)}!`);
      loadBookings();
      if (selectedBooking && selectedBooking.bookingReservationID === id) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      setError('Failed to update booking status.');
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case 1: return 'Confirmed';
      case 2: return 'Completed';
      case 0: return 'Cancelled';
      default: return `Status ${s}`;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 1: return <span className="badge badge-confirmed">Confirmed (1)</span>;
      case 2: return <span className="badge badge-completed">Completed (2)</span>;
      case 0: return <span className="badge badge-cancelled">Cancelled (0)</span>;
      default: return <span className="badge badge-secondary">{s}</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Booking Reservations Management (Staff)
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Inspect all guest booking transactions, verify room details, and manage reservation statuses
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by customer name or email..."
            style={{ maxWidth: '320px' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="form-control"
            style={{ maxWidth: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="1">Confirmed (1)</option>
            <option value="2">Completed (2)</option>
            <option value="0">Cancelled (0)</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={() => { setKeyword(''); setStatusFilter(''); loadBookings(); }} className="btn btn-secondary">
            Reset
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Rooms Booked</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading reservations...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No reservations found.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingReservationID}>
                  <td><strong>#{b.bookingReservationID}</strong></td>
                  <td>{b.bookingDate}</td>
                  <td>
                    <strong>{b.customerFullName}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.customerEmail}</div>
                  </td>
                  <td><strong style={{ color: '#2563eb' }}>${Number(b.totalPrice).toFixed(2)}</strong></td>
                  <td>
                    <span className="badge badge-staff">
                      {b.bookingDetails?.length || 0} room(s)
                    </span>
                  </td>
                  <td>{getStatusBadge(b.bookingStatus)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => setSelectedBooking(b)} className="btn btn-secondary btn-sm">
                        View Details
                      </button>
                      <select
                        className="form-control"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b.bookingReservationID, Number(e.target.value))}
                      >
                        <option value={1}>Confirmed</option>
                        <option value={2}>Completed</option>
                        <option value={0}>Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Reservation Details #{selectedBooking.bookingReservationID}
              </h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Customer:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.customerFullName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>{selectedBooking.customerEmail}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reservation Date:</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.bookingDate}</div>
                  <div style={{ marginTop: '0.25rem' }}>{getStatusBadge(selectedBooking.bookingStatus)}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Rooms Reserved in this Transaction
              </h4>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBooking.bookingDetails?.map((d, idx) => (
                      <tr key={idx}>
                        <td><strong>Room {d.roomNumber}</strong></td>
                        <td>{d.roomTypeName}</td>
                        <td>{d.startDate}</td>
                        <td>{d.endDate}</td>
                        <td><strong>${Number(d.actualPrice).toFixed(2)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b', marginRight: '0.5rem' }}>Total Reservation Amount:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>
                  ${Number(selectedBooking.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedBooking(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBookingsPage;

