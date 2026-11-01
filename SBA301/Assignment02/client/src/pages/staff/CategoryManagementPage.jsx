/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Staff Category Management Page
 */
import React, { useState, useEffect } from 'react';
import categoryApi from '../../api/categoryApi';
import CategoryModal from '../../components/category/CategoryModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { FolderTree, Plus, Search, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete Confirm State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState(null);

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchCategories = async (query = '') => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll(query);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategories(keyword);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (formData) => {
    try {
      setModalLoading(true);
      if (editingCategory) {
        await categoryApi.update(editingCategory.categoryID, formData);
        showNotify('success', 'Cập nhật danh mục thành công!');
      } else {
        await categoryApi.create(formData);
        showNotify('success', 'Thêm mới danh mục thành công!');
      }
      setIsModalOpen(false);
      fetchCategories(keyword);
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
      await categoryApi.delete(deletingId);
      showNotify('success', 'Xóa danh mục thành công!');
      setIsDeleteOpen(false);
      fetchCategories(keyword);
    } catch (err) {
      // Đề bài: Nếu danh mục đã có bài viết, chặn xóa và báo lỗi
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
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" /> Quản Trị Danh Mục Tin Tức
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Quản Lý Danh Mục Tin Tức</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý chuyên mục tin tức, phân cấp danh mục cha con</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Notification Toast */}
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
              placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
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

      {/* Category Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên Danh Mục</th>
                <th className="px-6 py-4">Mô Tả</th>
                <th className="px-6 py-4">Danh Mục Cha</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-medium">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">#{cat.categoryID}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{cat.categoryName}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{cat.categoryDesciption || '—'}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {cat.parentCategoryName ? (
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                          {cat.parentCategoryName}
                        </span>
                      ) : '— (Gốc)'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cat.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {cat.isActive ? 'Active (1)' : 'Inactive (0)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(cat.categoryID)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Xóa danh mục"
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

      {/* Modal Popup Create/Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        categories={categories}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Xác nhận xóa danh mục"
        message="Lưu ý: Nếu danh mục này đang chứa bài viết tin tức, hệ thống sẽ chặn xóa để đảm bảo toàn vẹn dữ liệu theo đúng yêu cầu đề bài."
      />
    </div>
  );
};

export default CategoryManagementPage;
