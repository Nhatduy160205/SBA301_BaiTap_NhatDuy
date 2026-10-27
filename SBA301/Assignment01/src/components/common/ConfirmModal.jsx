import React from "react";

export const ConfirmModal = ({
  show,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.",
  itemName,
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  variant = "danger",
  onConfirm,
  onCancel
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div className={`modal-header bg-${variant} text-white px-4 py-3`}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <h5 className="modal-title fs-6 fw-bold mb-0">{title}</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body p-4 text-center">
            <div
              className={`rounded-circle bg-${variant}-subtle text-${variant} d-inline-flex p-3 mb-3`}
            >
              <i className="bi bi-trash3-fill fs-2"></i>
            </div>
            <p className="text-secondary mb-2">{message}</p>
            {itemName && (
              <div className="p-2 px-3 bg-body-tertiary rounded-3 fw-semibold text-break border">
                "{itemName}"
              </div>
            )}
          </div>
          <div className="modal-footer bg-body-tertiary border-top-0 px-4 py-3 justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 rounded-3"
              onClick={onCancel}
            >
              <i className="bi bi-x-circle me-1"></i> {cancelText}
            </button>
            <button
              type="button"
              className={`btn btn-${variant} px-4 rounded-3 fw-semibold shadow-sm`}
              onClick={onConfirm}
            >
              <i className="bi bi-check-circle me-1"></i> {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
