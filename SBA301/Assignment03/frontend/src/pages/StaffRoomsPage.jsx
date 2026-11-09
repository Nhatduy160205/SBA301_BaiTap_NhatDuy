import React, { useState, useEffect } from 'react';
import { roomApi, roomTypeApi } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

const StaffRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search filters
  const [searchNumber, setSearchNumber] = useState('');
  const [filterType, setFilterType] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeID: 1,
    roomStatus: 1,
    roomPricePerDay: 50.0,
  });

  // Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    room: null,
    loading: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomApi.getAllRooms(false),
        roomTypeApi.getAll(),
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
      if (typesRes.data.length > 0 && !formData.roomTypeID) {
        setFormData((prev) => ({ ...prev, roomTypeID: typesRes.data[0].roomTypeID }));
      }
    } catch (err) {
      setError('Failed to load room data.');
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
      if (searchNumber.trim()) params.roomNumber = searchNumber.trim();
      if (filterType) params.roomTypeID = filterType;
      const res = await roomApi.searchRooms(params);
      setRooms(res.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeID: roomTypes[0]?.roomTypeID || 1,
      roomStatus: 1,
      roomPricePerDay: 50.0,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    setIsEditing(true);
    setCurrentId(room.roomID);
    setFormData({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity,
      roomTypeID: room.roomTypeID,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isEditing) {
        await roomApi.updateRoom(currentId, formData);
        setSuccess(`Room ${formData.roomNumber} updated successfully!`);
      } else {
        await roomApi.createRoom(formData);
        setSuccess(`Room ${formData.roomNumber} created successfully!`);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save room details.';
      setError(msg);
    }
  };

  /**
   * Special rule from assignment:
   * "The delete action will delete room information in the case this information is not belong
   * to any renting transaction. If the room information is already stored in a booking detail,
   * just change the status."
   */
  const handleOpenDelete = (room) => {
    setDeleteConfirm({
      isOpen: true,
      room,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const room = deleteConfirm.room;
    if (!room) return;

    setDeleteConfirm((prev) => ({ ...prev, loading: true }));
    setError('');
    setSuccess('');
    try {
      const res = await roomApi.deleteRoom(room.roomID);
      const { action, message } = res.data;
      if (action === 'DEACTIVATED') {
        setSuccess(`ℹ️ ${message}`);
      } else {
        setSuccess(`🗑️ ${message}`);
      }
      setDeleteConfirm({ isOpen: false, room: null, loading: false });
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed.';
      setError(msg);
      setDeleteConfirm({ isOpen: false, room: null, loading: false });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Room Management (Staff)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Add, update, or remove hotel rooms with automatic renting history validation
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add New Room
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filter / Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Room Number..."
            style={{ maxWidth: '250px' }}
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
          <select
            className="form-control"
            style={{ maxWidth: '220px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Room Types</option>
            {roomTypes.map((t) => (
              <option key={t.roomTypeID} value={t.roomTypeID}>
                {t.roomTypeName}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={() => { setSearchNumber(''); setFilterType(''); loadData(); }} className="btn btn-secondary">
            Reset
          </button>
        </form>
      </div>

      {/* Rooms Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room No</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price / Day</th>
              <th>Status</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading rooms...</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No rooms found.</td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.roomID}>
                  <td>#{r.roomID}</td>
                  <td><strong>Room {r.roomNumber}</strong></td>
                  <td><span className="badge badge-customer">{r.roomTypeName}</span></td>
                  <td>{r.roomMaxCapacity} guests</td>
                  <td><strong style={{ color: '#2563eb' }}>${r.roomPricePerDay}</strong></td>
                  <td>
                    <span className={`badge ${r.roomStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {r.roomStatus === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.roomDetailDescription || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEdit(r)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleOpenDelete(r)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {isEditing ? `Edit Room ${formData.roomNumber}` : 'Add New Room'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Room Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. R501"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room Type *</label>
                  <select
                    className="form-control"
                    required
                    value={formData.roomTypeID}
                    onChange={(e) => setFormData({ ...formData, roomTypeID: Number(e.target.value) })}
                  >
                    {roomTypes.map((t) => (
                      <option key={t.roomTypeID} value={t.roomTypeID}>
                        {t.roomTypeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Max Capacity (Guests) *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      required
                      value={formData.roomMaxCapacity}
                      onChange={(e) => setFormData({ ...formData, roomMaxCapacity: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price / Day ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      className="form-control"
                      required
                      value={formData.roomPricePerDay}
                      onChange={(e) => setFormData({ ...formData, roomPricePerDay: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={formData.roomStatus}
                    onChange={(e) => setFormData({ ...formData, roomStatus: Number(e.target.value) })}
                  >
                    <option value={1}>Active / Available (1)</option>
                    <option value={0}>Inactive / Closed (0)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Room amenities, views, bed configurations..."
                    value={formData.roomDetailDescription}
                    onChange={(e) => setFormData({ ...formData, roomDetailDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Confirm Delete Room"
        message={`Are you sure you want to delete Room ${deleteConfirm.room?.roomNumber}?\n\nNote: If this room has existing booking records, its status will be changed to Inactive to preserve booking history.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteConfirm.loading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, room: null, loading: false })}
      />
    </div>
  );
};

export default StaffRoomsPage;

