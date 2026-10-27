import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-body-tertiary">
      <div className="display-1 fw-bold text-primary mb-2">404</div>
      <h3 className="fw-bold mb-3">Không tìm thấy trang yêu cầu</h3>
      <p className="text-secondary mb-4" style={{ maxWidth: "480px" }}>
        Đường dẫn bạn vừa truy cập không tồn tại hoặc đã bị di chuyển trong hệ thống quản trị FUNewsManagementSystem.
      </p>
      <Link to="/dashboard" className="btn btn-primary rounded-3 px-4 py-2 fw-semibold shadow-sm">
        <i className="bi bi-house-door me-2"></i> Trở về Trang Chủ Dashboard
      </Link>
    </div>
  );
};
