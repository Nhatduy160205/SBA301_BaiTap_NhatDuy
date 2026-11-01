/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Category Create/Update Popup Dialog
 */
import React, { useState, useEffect } from 'react';
import ModalWrapper from '../common/ModalWrapper';

const CategoryModal = ({ isOpen, onClose, onSave, editingCategory, categories = [], loading }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesciption: '',
    parentCategoryID: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.categoryName || '',
        categoryDesciption: editingCategory.categoryDesciption || '',
        parentCategoryID: editingCategory.parentCategoryID || '',
        isActive: editingCategory.isActive !== undefined ? editingCategory.isActive : true,
      });
    } else {
      setFormData({
        categoryName: '',
        categoryDesciption: '',
        parentCategoryID: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [editingCategory, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.categoryName.trim()) {
      errs.categoryName = 'Tên danh mục không được để trống';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      parentCategoryID: formData.parentCategoryID ? Number(formData.parentCategoryID) : null,
    });
  };

  // Lọc bỏ danh mục hiện tại ra khỏi danh sách chọn danh mục cha để tránh vòng lặp
  const availableParents = categories.filter(c => !editingCategory || c.categoryID !== editingCategory.categoryID);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? "Cập Nhật Danh Mục (Update Category)" : "Thêm Danh Mục Mới (Create Category)"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên danh mục */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Tên Danh Mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Ví dụ: Công nghệ thông tin..."
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          />
          {errors.categoryName && <p className="text-xs text-red-500 mt-1">{errors.categoryName}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Mô Tả Danh Mục
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Mô tả chi tiết nội dung danh mục..."
            value={formData.categoryDesciption}
            onChange={(e) => setFormData({ ...formData, categoryDesciption: e.target.value })}
          />
        </div>

        {/* Danh mục cha (Parent Category) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Danh Mục Cha (Tùy chọn)
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            value={formData.parentCategoryID}
            onChange={(e) => setFormData({ ...formData, parentCategoryID: e.target.value })}
          >
            <option value="">-- Không có (Danh mục gốc) --</option>
            {availableParents.map((cat) => (
              <option key={cat.categoryID} value={cat.categoryID}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái hoạt động */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 select-none">
            Trạng thái hoạt động (Active = 1)
          </label>
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
            {loading ? "Đang lưu..." : (editingCategory ? "Cập Nhật" : "Tạo Mới")}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default CategoryModal;
