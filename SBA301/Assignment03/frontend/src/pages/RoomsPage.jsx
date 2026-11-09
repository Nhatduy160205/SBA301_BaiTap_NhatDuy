import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi, roomTypeApi, bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomsPage = () => {
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search filters
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Booking Cart State (Customer can select 1 or many rooms!)
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAllRooms(false),
        roomTypeApi.getAll(),
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
    } catch (err) {
      setError('Unable to load rooms. Please check if the Backend server is running.');
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
      if (roomNumber.trim()) params.roomNumber = roomNumber.trim();
      if (selectedType) params.roomTypeID = selectedType;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await roomApi.searchRooms(params);
      setRooms(res.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setRoomNumber('');
    setSelectedType('');
    setMaxPrice('');
    fetchInitialData();
  };

  const toggleSelectRoom = (roomId) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  // Calculate booking days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // Calculate total price of selected rooms
  const calculateTotal = () => {
    const days = calculateDays();
    return selectedRoomIds.reduce((sum, id) => {
      const room = rooms.find((r) => r.roomID === id);
      return sum + (room ? Number(room.roomPricePerDay) * days : 0);
    }, 0);
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCustomer) {
      setError('Staff should manage bookings from the Staff Bookings page.');
      return;
    }
    if (selectedRoomIds.length === 0) {
      setError('Please select at least one room to book.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Check-out date must be after or equal to check-in date.');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingDetails = selectedRoomIds.map((roomId) => ({
        roomID: roomId,
        startDate: startDate,
        endDate: endDate,
      }));

      await bookingApi.createBooking({
        bookingDetails,
      });

      setSuccess('🎉 Booking successfully created! Redirecting to your booking history...');
      setSelectedRoomIds([]);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking. Please try another date or room.';
      setError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
          Explore Our Premium Hotel Rooms
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
          Browse available rooms, view details, and book one or multiple rooms online instantly.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Room Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. R101, R202..."
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Room Type</label>
            <select
              className="form-control"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Room Types</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeID} value={t.roomTypeID}>
                  {t.roomTypeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Max Price / Day ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              🔍 Search
            </button>
            <button type="button" onClick={handleResetSearch} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Booking Date Selection Panel (For quick multi-room booking) */}
      <div className="card" style={{ marginBottom: '2rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
            <div>
              <label className="form-label">Check-in Date:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                min={todayStr}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Check-out Date:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                min={startDate || todayStr}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div style={{ alignSelf: 'flex-end', paddingBottom: '0.4rem', color: '#475569', fontSize: '0.9rem' }}>
              Duration: <strong>{calculateDays()} night(s)</strong> | Selected: <strong>{selectedRoomIds.length} room(s)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Estimated Total:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb' }}>
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleConfirmBooking}
              disabled={selectedRoomIds.length === 0 || bookingLoading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              {bookingLoading ? 'Processing...' : 'Book Selected Rooms'}
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading rooms catalog...
        </div>
      ) : rooms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          No rooms found matching your search criteria.
        </div>
      ) : (
        <div className="grid-cards">
          {rooms.map((room) => {
            const isSelected = selectedRoomIds.includes(room.roomID);
            const isActive = room.roomStatus === 1;

            return (
              <div
                key={room.roomID}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  position: 'relative',
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                        Room {room.roomNumber}
                      </h3>
                      <span className="badge badge-customer" style={{ marginTop: '0.25rem' }}>
                        {room.roomTypeName || 'Standard'}
                      </span>
                    </div>
                    <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {isActive ? 'Available' : 'Inactive'}
                    </span>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '2.5rem' }}>
                    {room.roomDetailDescription || 'Modern, clean and fully equipped hotel room.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                    <span>👥 Max Capacity: <strong>{room.roomMaxCapacity} guests</strong></span>
                    <span>Rate: <strong style={{ color: '#2563eb', fontSize: '1.05rem' }}>${room.roomPricePerDay}</strong> / night</span>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => toggleSelectRoom(room.roomID)}
                      className={`btn ${isSelected ? 'btn-danger' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                    >
                      {isSelected ? '✓ Remove from Booking' : '+ Select this Room'}
                    </button>
                  ) : (
                    <button disabled className="btn btn-secondary" style={{ width: '100%', cursor: 'not-allowed' }}>
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

