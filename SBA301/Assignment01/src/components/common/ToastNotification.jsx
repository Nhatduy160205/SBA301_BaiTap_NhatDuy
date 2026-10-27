import React, { useEffect } from "react";

export const ToastNotification = ({
  toast, // { show, type: 'success'|'danger'|'info'|'warning', message, title }
  onClose
}) => {
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast?.show) return null;

  const bgClass =
    toast.type === "success"
      ? "bg-success text-white"
      : toast.type === "danger"
      ? "bg-danger text-white"
      : toast.type === "warning"
      ? "bg-warning text-dark"
      : "bg-primary text-white";

  const iconClass =
    toast.type === "success"
      ? "bi-check-circle-fill"
      : toast.type === "danger"
      ? "bi-x-octagon-fill"
      : toast.type === "warning"
      ? "bi-exclamation-triangle-fill"
      : "bi-info-circle-fill";

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999, maxWidth: "380px" }}
    >
      <div
        className={`toast show border-0 shadow-lg rounded-4 overflow-hidden ${bgClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex align-items-center p-3">
          <i className={`bi ${iconClass} fs-4 me-3`}></i>
          <div className="flex-grow-1">
            {toast.title && <div className="fw-bold fs-6">{toast.title}</div>}
            <div className="small">{toast.message}</div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};
