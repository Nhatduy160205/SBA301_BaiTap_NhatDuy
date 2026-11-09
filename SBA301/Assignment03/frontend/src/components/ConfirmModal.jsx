import React from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '450px',
          width: '100%',
          padding: '2rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: confirmVariant === 'danger' ? '#fef2f2' : '#eff6ff',
            color: confirmVariant === 'danger' ? '#dc2626' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1.25rem',
            border: confirmVariant === 'danger' ? '2px solid #fecaca' : '2px solid #bfdbfe',
          }}
        >
          {confirmVariant === 'danger' ? '🗑️' : '❓'}
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '0.65rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: '#64748b',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{
              minWidth: '115px',
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
            disabled={loading}
            style={{
              minWidth: '115px',
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              borderRadius: '8px',
              backgroundColor: confirmVariant === 'danger' ? '#dc2626' : '#2563eb',
              borderColor: confirmVariant === 'danger' ? '#dc2626' : '#2563eb',
              color: '#ffffff',
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

