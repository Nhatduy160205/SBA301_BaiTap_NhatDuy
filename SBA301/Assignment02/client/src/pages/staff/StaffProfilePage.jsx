/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Staff Profile Page (Manage his/her profile)
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import accountApi from '../../api/accountApi';
import { UserCheck, Mail, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const StaffProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [accountName, setAccountName] = useState(user?.accountName || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountName.trim()) {
      showNotify('error', 'Họ và tên không được để trống');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showNotify('error', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const res = await accountApi.updateProfile(user.accountID, {
        accountName,
        oldPassword: oldPassword || null,
        newPassword: newPassword || null,
      });

      if (res.success) {
        updateUser({ accountName: res.data.accountName });
        showNotify('success', 'Cập nhật thông tin cá nhân thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" /> Tài khoản cá nhân
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Hồ Sơ Nhân Viên (Staff Profile)</h1>
        <p className="text-sm text-slate-500 mt-1">Xem và quản lý thông tin tài khoản cá nhân của bạn</p>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Account Card Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-2xl font-black mb-4 shadow-inner">
            {user?.accountName?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{user?.accountName}</h3>
          <p className="text-xs text-slate-400 mb-4">{user?.accountEmail}</p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Shield className="w-3.5 h-3.5" /> Nhân Viên (Staff)
          </span>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left text-xs space-y-2 text-slate-500">
            <div>Mã định danh: <strong className="text-slate-700 font-mono">#{user?.accountID}</strong></div>
            <div>Quyền hệ thống: <strong className="text-slate-700">Role 2 (Staff)</strong></div>
          </div>
        </div>

        {/* Right Form: Update Name & Change Password */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">
            Chỉnh Sửa Thông Tin
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Đăng Ký (Không thể sửa)
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.accountEmail || ''}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Change Password Sub-section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-500" /> Đổi Mật Khẩu (Để trống nếu không muốn đổi)
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;
