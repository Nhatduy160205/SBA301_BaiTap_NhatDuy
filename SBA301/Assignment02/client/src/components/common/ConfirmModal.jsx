/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Delete Confirmation Modal
 */
import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Xác nhận xóa", message, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100 text-center">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {message || "Hành động này sẽ xóa dữ liệu vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 shadow-sm shadow-red-200 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {loading ? "Đang xóa..." : "Xác nhận xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
