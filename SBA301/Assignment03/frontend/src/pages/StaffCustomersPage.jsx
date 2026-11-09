import React, { useState, useEffect } from 'react';
import { customerApi } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

const StaffCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [keyword, setKeyword] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '2000-01-01',
    customerStatus: 1,
    password: '',
  });

  // Status Confirmation Modal State
  const [statusConfirm, setStatusConfirm] = useState({
    isOpen: false,
    customer: null,
    newStatus: 1,
    loading: false,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } catch (err) {
      setError('Failed to load customers list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await customerApi.search(keyword);
      setCustomers(res.data);
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
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '2000-01-01',
      customerStatus: 1,
      password: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setIsEditing(true);
    setCurrentId(customer.customerID);
    setFormData({
      customerFullName: customer.customerFullName,
      telephone: customer.telephone,
      emailAddress: customer.emailAddress,
      customerBirthday: customer.customerBirthday || '2000-01-01',
      customerStatus: customer.customerStatus,
      password: '', // keep blank unless changing
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isEditing) {
        await customerApi.update(currentId, formData);
        setSuccess(`Customer ${formData.customerFullName} updated successfully!`);
      } else {
        await customerApi.create(formData);
        setSuccess(`Customer ${formData.customerFullName} registered successfully!`);
      }
      setShowModal(false);
      loadCustomers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save customer.';
      setError(msg);
    }
  };

  const handleOpenToggleStatus = (customer) => {
    const newStatus = customer.customerStatus === 1 ? 0 : 1;
    setStatusConfirm({
      isOpen: true,
      customer,
      newStatus,
      loading: false,
    });
  };

  const handleConfirmToggleStatus = async () => {
    const { customer, newStatus } = statusConfirm;
    if (!customer) return;

    setStatusConfirm((prev) => ({ ...prev, loading: true }));
    setError('');
    setSuccess('');
    try {
      await customerApi.update(customer.customerID, {
        ...customer,
        customerStatus: newStatus,
      });
      setSuccess(`Customer ${customer.customerFullName} has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`);
      setStatusConfirm({ isOpen: false, customer: null, newStatus: 1, loading: false });
      loadCustomers();
    } catch (err) {
      setError('Failed to update customer status.');
      setStatusConfirm({ isOpen: false, customer: null, newStatus: 1, loading: false });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Customer Management (Staff)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Manage customer profiles, registration details, and account active statuses
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add Customer
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Search Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by customer name, email, or telephone..."
            style={{ maxWidth: '350px' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={() => { setKeyword(''); loadCustomers(); }} className="btn btn-secondary">
            Reset
          </button>
        </form>
      </div>

      {/* Customer Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Birthday</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.customerID}>
                  <td>#{c.customerID}</td>
                  <td><strong>{c.customerFullName}</strong></td>
                  <td>{c.emailAddress}</td>
                  <td>{c.telephone}</td>
                  <td>{c.customerBirthday || '—'}</td>
                  <td>
                    <span className={`badge ${c.customerStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {c.customerStatus === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEdit(c)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenToggleStatus(c)}
                        className={`btn ${c.customerStatus === 1 ? 'btn-danger' : 'btn-success'} btn-sm`}
                      >
                        {c.customerStatus === 1 ? 'Deactivate' : 'Activate'}
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
                {isEditing ? `Edit Customer: ${formData.customerFullName}` : 'Create Customer Account'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.customerFullName}
                    onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telephone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Birthday *</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.customerBirthday}
                    onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={formData.customerStatus}
                    onChange={(e) => setFormData({ ...formData, customerStatus: Number(e.target.value) })}
                  >
                    <option value={1}>Active (1)</option>
                    <option value={0}>Inactive (0)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isEditing ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    required={!isEditing}
                    placeholder={isEditing ? 'Enter new password if changing' : 'Minimum 6 characters'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Status Toggle / Deactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={statusConfirm.isOpen}
        title={statusConfirm.newStatus === 1 ? 'Activate Customer' : 'Deactivate Customer'}
        message={`Are you sure you want to ${statusConfirm.newStatus === 1 ? 'activate' : 'deactivate'} customer "${statusConfirm.customer?.customerFullName}"?\n\n${statusConfirm.newStatus === 1 ? 'The customer will be able to log in and make bookings.' : 'The customer will be suspended and prevented from logging in.'}`}
        confirmText={statusConfirm.newStatus === 1 ? 'Activate' : 'Deactivate'}
        cancelText="Cancel"
        confirmVariant={statusConfirm.newStatus === 1 ? 'primary' : 'danger'}
        loading={statusConfirm.loading}
        onConfirm={handleConfirmToggleStatus}
        onClose={() => setStatusConfirm({ isOpen: false, customer: null, newStatus: 1, loading: false })}
      />
    </div>
  );
};

export default StaffCustomersPage;

