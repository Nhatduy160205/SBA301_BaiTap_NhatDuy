/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Account Create/Update Popup Dialog
 */
import React, { useState, useEffect } from 'react';
import ModalWrapper from '../common/ModalWrapper';

const AccountModal = ({ isOpen, onClose, onSave, editingAccount, loading }) => {
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountRole: 2,
    accountPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountName: editingAccount.accountName || '',
        accountEmail: editingAccount.accountEmail || '',
        accountRole: editingAccount.accountRole || 2,
        accountPassword: '',
      });
    } else {
      setFormData({
        accountName: '',
        accountEmail: '',
        accountRole: 2,
        accountPassword: '',
      });
    }
    setErrors({});
  }, [editingAccount, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.accountName.trim()) {
      errs.accountName = 'Tên tài khoản không được để trống';
    }
    if (!formData.accountEmail.trim()) {
      errs.accountEmail = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.accountEmail)) {
      errs.accountEmail = 'Email không hợp lệ';
    }
    if (!editingAccount && !formData.accountPassword.trim()) {
      errs.accountPassword = 'Mật khẩu là bắt buộc khi tạo tài khoản mới';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={editingAccount ? "Cập Nhật Tài Khoản (Update Account)" : "Thêm Tài Khoản Mới (Create Account)"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên tài khoản */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Nhập họ và tên..."
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
          />
          {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email Đăng Nhập <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="example@funews.edu.vn"
            value={formData.accountEmail}
            onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
          />
          {errors.accountEmail && <p className="text-xs text-red-500 mt-1">{errors.accountEmail}</p>}
        </div>

        {/* Vai trò (Role) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Vai Trò (Role) <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            value={formData.accountRole}
            onChange={(e) => setFormData({ ...formData, accountRole: Number(e.target.value) })}
          >
            <option value={1}>1 - Quản Trị Viên (Admin)</option>
            <option value={2}>2 - Nhân Viên (Staff)</option>
          </select>
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Mật Khẩu {editingAccount ? "(Để trống nếu không đổi)" : <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={editingAccount ? "••••••••" : "Nhập mật khẩu..."}
            value={formData.accountPassword}
            onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
          />
          {errors.accountPassword && <p className="text-xs text-red-500 mt-1">{errors.accountPassword}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-200 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : (editingAccount ? "Cập Nhật" : "Tạo Mới")}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AccountModal;
