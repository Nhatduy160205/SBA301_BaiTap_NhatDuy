/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Staff News Article Management Page
 */
import React, { useState, useEffect } from 'react';
import newsApi from '../../api/newsApi';
import categoryApi from '../../api/categoryApi';
import tagApi from '../../api/tagApi';
import { useAuth } from '../../context/AuthContext';
import NewsModal from '../../components/news/NewsModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Newspaper, Plus, Search, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, Tag as TagIcon, Calendar, User } from 'lucide-react';

const NewsManagementPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState(null);

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [artRes, catRes, tagRes] = await Promise.all([
        newsApi.getAll(keyword),
        categoryApi.getAll('', false),
        tagApi.getAll(),
      ]);

      if (artRes.success) setArticles(artRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (tagRes.success) setTags(tagRes.data);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await newsApi.getAll(keyword);
      if (res.success) setArticles(res.data);
    } catch (err) {
      showNotify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingNews(article);
    setIsModalOpen(true);
  };

  const handleSaveArticle = async (formData) => {
    try {
      setModalLoading(true);
      if (editingNews) {
        await newsApi.update(editingNews.newsArticleID, {
          ...formData,
          updatedByID: user?.accountID,
        });
        showNotify('success', 'Cập nhật bài viết thành công!');
      } else {
        await newsApi.create({
          ...formData,
          createdByID: user?.accountID,
        });
        showNotify('success', 'Thêm bài viết mới thành công!');
      }
      setIsModalOpen(false);
      loadData();
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
      await newsApi.delete(deletingId);
      showNotify('success', 'Xóa bài viết thành công!');
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
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
            <Newspaper className="w-4 h-4" /> Quản Lý Bài Viết Tin Tức
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Quản Lý Bài Viết Tin Tức</h1>
          <p className="text-sm text-slate-500 mt-1">Đăng tin bài, quản lý nội dung, danh mục và gán thẻ tags</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bài Viết Mới</span>
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
              placeholder="Tìm bài viết theo tiêu đề, tóm tắt, nội dung..."
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

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã</th>
                <th className="px-6 py-4">Tiêu Đề & Tags</th>
                <th className="px-6 py-4">Danh Mục</th>
                <th className="px-6 py-4">Người Tạo</th>
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
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-medium">
                    Không tìm thấy bài viết tin tức nào.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.newsArticleID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">{art.newsArticleID}</td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-slate-800 line-clamp-1 mb-1">{art.newsTitle}</div>
                      <div className="flex flex-wrap gap-1">
                        {art.tags && art.tags.map(t => (
                          <span key={t.tagID} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            #{t.tagName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                        {art.categoryName || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="font-semibold text-slate-700">{art.createdByName}</div>
                      <div className="text-[11px] text-slate-400">
                        {art.createdDate ? new Date(art.createdDate).toLocaleDateString('vi-VN') : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        art.newsStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {art.newsStatus ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {art.newsStatus ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(art.newsArticleID)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Xóa bài viết"
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
      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArticle}
        editingNews={editingNews}
        categories={categories}
        tags={tags}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Xác nhận xóa bài viết tin tức"
        message="Hành động này sẽ xóa hoàn toàn bài viết và các liên kết thẻ tags tương ứng. Bạn có chắc chắn muốn xóa không?"
      />
    </div>
  );
};

export default NewsManagementPage;
