import React from "react";

export const NewsDetailModal = ({ show, newsItem, categoryName, onClose }) => {
  if (!show || !newsItem) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="modal-header bg-primary-subtle text-primary border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-file-text-fill fs-5"></i>
              <h5 className="modal-title fs-6 fw-bold mb-0">Chi Tiết Bài Viết #{newsItem.id}</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Category and Status Badge */}
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <span className="badge bg-primary rounded-pill px-3 py-1">
                <i className="bi bi-folder-fill me-1"></i>
                {categoryName || `Category #${newsItem.categoryId}`}
              </span>
              {Number(newsItem.status) === 1 ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                  <i className="bi bi-check-circle-fill me-1"></i> Xuất bản (Active)
                </span>
              ) : (
                <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-3 py-1">
                  <i className="bi bi-clock-history me-1"></i> Bản nháp (Inactive)
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="fw-bold text-body mb-3 lh-sm">{newsItem.title}</h4>

            {/* Metadata bar */}
            <div className="d-flex flex-wrap gap-3 align-items-center text-secondary small py-2 px-3 bg-body-tertiary rounded-3 mb-4">
              <div>
                <i className="bi bi-person-fill text-primary me-1"></i>
                Tác giả: <strong>{newsItem.createdBy || "Admin"}</strong>
              </div>
              <div>
                <i className="bi bi-calendar3 text-primary me-1"></i>
                Ngày tạo:{" "}
                <strong>
                  {newsItem.createdAt
                    ? new Date(newsItem.createdAt).toLocaleString("vi-VN")
                    : "N/A"}
                </strong>
              </div>
              {newsItem.updatedAt && (
                <div>
                  <i className="bi bi-pencil-fill text-info me-1"></i>
                  Cập nhật:{" "}
                  <strong>{new Date(newsItem.updatedAt).toLocaleString("vi-VN")}</strong>
                </div>
              )}
            </div>

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-4">
                <div className="small text-secondary fw-semibold mb-2">Thẻ bài viết:</div>
                <div className="d-flex flex-wrap gap-1">
                  {newsItem.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-light text-dark border rounded-pill px-2 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-3 bg-body rounded-3 border">
              <div
                className="text-body lh-base"
                style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}
              >
                {newsItem.content}
              </div>
            </div>
          </div>

          <div className="modal-footer bg-body-tertiary border-top-0 px-4 py-3">
            <button
              type="button"
              className="btn btn-secondary rounded-3 px-4"
              onClick={onClose}
            >
              <i className="bi bi-x-circle me-1"></i> Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
