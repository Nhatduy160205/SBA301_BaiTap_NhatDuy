/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * News Article Create/Update Popup Dialog
 */
import React, { useState, useEffect } from 'react';
import ModalWrapper from '../common/ModalWrapper';

const NewsModal = ({ isOpen, onClose, onSave, editingNews, categories = [], tags = [], loading }) => {
  const [formData, setFormData] = useState({
    newsArticleID: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryID: '',
    newsStatus: true,
    tagIDs: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingNews) {
      setFormData({
        newsArticleID: editingNews.newsArticleID || '',
        newsTitle: editingNews.newsTitle || '',
        headline: editingNews.headline || '',
        newsContent: editingNews.newsContent || '',
        newsSource: editingNews.newsSource || '',
        categoryID: editingNews.categoryID || (categories[0]?.categoryID || ''),
        newsStatus: editingNews.newsStatus !== undefined ? editingNews.newsStatus : true,
        tagIDs: editingNews.tags ? editingNews.tags.map(t => t.tagID) : [],
      });
    } else {
      setFormData({
        newsArticleID: '',
        newsTitle: '',
        headline: '',
        newsContent: '',
        newsSource: 'FPT University',
        categoryID: categories[0]?.categoryID || '',
        newsStatus: true,
        tagIDs: [],
      });
    }
    setErrors({});
  }, [editingNews, categories, isOpen]);

  const toggleTag = (tagId) => {
    setFormData(prev => {
      const exists = prev.tagIDs.includes(tagId);
      return {
        ...prev,
        tagIDs: exists ? prev.tagIDs.filter(id => id !== tagId) : [...prev.tagIDs, tagId],
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.newsTitle.trim()) {
      errs.newsTitle = 'Tiêu đề bài viết không được để trống';
    }
    if (!formData.newsContent.trim()) {
      errs.newsContent = 'Nội dung bài viết không được để trống';
    }
    if (!formData.categoryID) {
      errs.categoryID = 'Vui lòng chọn danh mục cho bài viết';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      categoryID: Number(formData.categoryID),
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={editingNews ? "Cập Nhật Bài Viết Tin Tức (Update Article)" : "Thêm Bài Viết Tin Tức Mới (Create Article)"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mã bài viết & Nguồn tin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mã Bài Viết (Tùy chọn tự sinh nếu để trống)
            </label>
            <input
              type="text"
              disabled={!!editingNews}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-slate-100"
              placeholder="VD: NEWS2026..."
              value={formData.newsArticleID}
              onChange={(e) => setFormData({ ...formData, newsArticleID: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nguồn Tin (News Source)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="FPT Education..."
              value={formData.newsSource}
              onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
            />
          </div>
        </div>

        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Tiêu Đề Tin Tức <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Nhập tiêu đề tin tức nổi bật..."
            value={formData.newsTitle}
            onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
          />
          {errors.newsTitle && <p className="text-xs text-red-500 mt-1">{errors.newsTitle}</p>}
        </div>

        {/* Tóm tắt / Headline */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Dòng Tóm Tắt (Headline)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          />
        </div>

        {/* Danh mục & Trạng thái */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Danh Mục <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              value={formData.categoryID}
              onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName} {!c.isActive ? '(Inactive)' : ''}
                </option>
              ))}
            </select>
            {errors.categoryID && <p className="text-xs text-red-500 mt-1">{errors.categoryID}</p>}
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                checked={formData.newsStatus}
                onChange={(e) => setFormData({ ...formData, newsStatus: e.target.checked })}
              />
              <span className="text-sm font-semibold text-slate-700">Trạng thái công khai (Active = 1)</span>
            </label>
          </div>
        </div>

        {/* Gán Tags */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Gắn Thẻ Nhãn (Tags)
          </label>
          <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[48px]">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-400">Chưa có thẻ tag nào trong hệ thống</span>
            ) : (
              tags.map((tag) => {
                const isSelected = formData.tagIDs.includes(tag.tagID);
                return (
                  <button
                    key={tag.tagID}
                    type="button"
                    onClick={() => toggleTag(tag.tagID)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    #{tag.tagName}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Nội Dung Chi Tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Soạn thảo nội dung bài viết tin tức tại đây..."
            value={formData.newsContent}
            onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
          />
          {errors.newsContent && <p className="text-xs text-red-500 mt-1">{errors.newsContent}</p>}
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
            {loading ? "Đang lưu..." : (editingNews ? "Cập Nhật Bài Viết" : "Xuất Bản Bài Viết")}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default NewsModal;
