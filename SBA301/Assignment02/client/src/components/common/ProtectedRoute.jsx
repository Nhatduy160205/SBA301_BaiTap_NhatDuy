/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Protected Route Component
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.accountRole)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md shadow-sm">
          <h2 className="text-xl font-bold mb-2">Truy cập bị từ chối (403 Forbidden)</h2>
          <p className="text-sm">Bạn không có quyền truy cập vào chức năng này. Vui lòng đăng nhập với tài khoản có thẩm quyền.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
