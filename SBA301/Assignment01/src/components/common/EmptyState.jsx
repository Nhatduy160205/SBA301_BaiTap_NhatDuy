import React from "react";

export const EmptyState = ({
  icon = "bi-inbox",
  title = "Không tìm thấy dữ liệu",
  description = "Không có bản ghi nào phù hợp với điều kiện tìm kiếm hoặc danh mục rỗng.",
  actionText,
  onAction
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3 my-4 bg-body-tertiary">
      <div className="card-body">
        <div
          className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: "64px", height: "64px" }}
        >
          <i className={`bi ${icon} fs-2`}></i>
        </div>
        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "420px" }}>
          {description}
        </p>
        {actionText && onAction && (
          <button
            type="button"
            className="btn btn-outline-primary rounded-3 px-4 fw-semibold"
            onClick={onAction}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
