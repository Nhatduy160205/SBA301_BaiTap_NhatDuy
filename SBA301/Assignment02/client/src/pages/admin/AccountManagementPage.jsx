/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Admin Account Management Page
 */
import React, { useState, useEffect } from 'react';
import accountApi from '../../api/accountApi';
import AccountModal from '../../components/account/AccountModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Users, Plus, Search, Edit2, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';

const AccountManagementPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete Confirm State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast / Alert Notification State
  const [notification, setNotification] = useState(null);

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchAccounts = async (query = '') => {
    try {
      setLoading(true);
      const res = await accountApi.getAll(query);
      if (res.success) {
        setAccounts(res.data);
      }
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccounts(keyword);
  };

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (formData) => {
    try {
      setModalLoading(true);
      if (editingAccount) {
        await accountApi.update(editingAccount.accountID, formData);
        showNotify('success', 'Cập nhật tài khoản thành công!');
      } else {
        await accountApi.create(formData);
        showNotify('success', 'Thêm mới tài khoản thành công!');
      }
      setIsModalOpen(false);
      fetchAccounts(keyword);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await accountApi.delete(deletingId);
      showNotify('success', 'Xóa tài khoản thành công!');
      setIsDeleteOpen(false);
      fetchAccounts(keyword);
    } catch (err) {
      // Đề bài: Nếu tài khoản đã tạo bài viết, hiển thị thông báo không thể xóa
      showNotify('error', err.message);
      setIsDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Khu vực Quản Trị Viên (Admin)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Quản Lý Tài Khoản Người Dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý thêm, sửa, xóa và phân quyền tài khoản hệ thống</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tài Khoản Mới</span>
        </button>
      </div>

      {/* Notification Toast Banner */}
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản theo tên hoặc email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Tìm Kiếm
          </button>
        </form>
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Họ và Tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai Trò</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.accountID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">#{acc.accountID}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {acc.accountName.charAt(0).toUpperCase()}
                      </div>
                      {acc.accountName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{acc.accountEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        acc.accountRole === 1
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {acc.accountRole === 1 ? '1 - Admin' : '2 - Staff'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(acc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Chỉnh sửa tài khoản"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(acc.accountID)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Popup Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        editingAccount={editingAccount}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Xác nhận xóa tài khoản"
        message="Lưu ý: Nếu tài khoản này đã từng tạo bất kỳ bài viết tin tức nào trong hệ thống, hệ thống sẽ từ chối xóa để đảm bảo toàn vẹn dữ liệu."
      />
    </div>
  );
};

export default AccountManagementPage;
