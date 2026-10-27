import React, { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { storageService } from "../services/storageService";
import { CategoryTable } from "../components/categories/CategoryTable";
import { CategoryModal } from "../components/categories/CategoryModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { EmptyState } from "../components/common/EmptyState";
import { ToastNotification } from "../components/common/ToastNotification";

export const CategoryManagementPage = () => {
  // Source lists
  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [modalState, setModalState] = useState({
    show: false,
    mode: "create", // "create" | "update"
    selectedItem: null
  });

  // Delete Confirm Modal state
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    item: null
  });

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  // Load initial data
  const loadData = () => {
    setCategories(categoryService.getAll());
    setNewsList(storageService.getNews());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  // CREATE dialog trigger
  const handleOpenCreate = () => {
    setModalState({
      show: true,
      mode: "create",
      selectedItem: null
    });
  };

  // UPDATE dialog trigger
  const handleOpenEdit = (category) => {
    setModalState({
      show: true,
      mode: "update",
      selectedItem: category
    });
  };

  // Close modal
  const handleCloseModal = () => {
    setModalState({
      show: false,
      mode: "create",
      selectedItem: null
    });
  };

  // Save (Create or Update) handler
  const handleSaveCategory = (formData) => {
    try {
      if (modalState.mode === "create") {
        const created = categoryService.create(formData);
        showToast("success", "Thành công!", `Đã tạo chuyên mục mới "${created.name}" thành công.`);
      } else {
        const updated = categoryService.update(modalState.selectedItem.id, formData);
        showToast("success", "Thành công!", `Đã cập nhật chuyên mục "${updated.name}" thành công.`);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      showToast("danger", "Lỗi thao tác", err.message || "Không thể lưu dữ liệu!");
    }
  };

  // DELETE trigger
  const handleOpenDelete = (category) => {
    setDeleteConfirm({
      show: true,
      item: category
    });
  };

  // Confirm DELETE execution
  const handleConfirmDelete = () => {
    if (!deleteConfirm.item) return;

    const result = categoryService.delete(deleteConfirm.item.id);
    if (result.success) {
      showToast("success", "Đã xóa thành công!", `Chuyên mục "${deleteConfirm.item.name}" đã được xóa.`);
      loadData();
    } else {
      showToast("warning", "Không thể xóa chuyên mục", result.error);
    }
    setDeleteConfirm({ show: false, item: null });
  };

  // Cancel DELETE
  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, item: null });
  };

  // Filtered list (keeps source list categories intact!)
  const displayedCategories = categoryService.search(categories, searchKeyword, statusFilter);

  const handleResetFilters = () => {
    setSearchKeyword("");
    setStatusFilter("all");
  };

  return (
    <div className="category-management">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-body">Quản Lý Chuyên Mục</h4>
          <p className="text-secondary small mb-0">
            Xem, thêm mới, cập nhật và tìm kiếm các danh mục tin tức của hệ thống
          </p>
        </div>
        <button
          type="button"
          id="btnCreateCategory"
          className="btn btn-primary rounded-3 px-3 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-plus-circle-fill"></i>
          Thêm Chuyên Mục Mới
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-body">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary border-end-0">
                  <i className="bi bi-search text-secondary"></i>
                </span>
                <input
                  type="text"
                  id="categorySearchInput"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm theo tên hoặc mô tả chuyên mục..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearchKeyword("")}
                    title="Xóa từ khóa tìm kiếm"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-6 col-md-3 col-lg-3">
              <select
                id="categoryStatusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động (Active)</option>
                <option value="0">Tạm khóa (Inactive)</option>
              </select>
            </div>

            {/* Clear filter button */}
            <div className="col-6 col-md-3 col-lg-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 rounded-3"
                onClick={handleResetFilters}
                disabled={!searchKeyword && statusFilter === "all"}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
              </button>
            </div>

            {/* Counter display */}
            <div className="col-12 col-lg-2 text-lg-end text-secondary small">
              Hiển thị: <strong>{displayedCategories.length}</strong> / {categories.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {displayedCategories.length > 0 ? (
        <CategoryTable
          categories={displayedCategories}
          newsList={newsList}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <EmptyState
          icon="bi-folder-x"
          title="Không tìm thấy chuyên mục phù hợp"
          description={
            searchKeyword || statusFilter !== "all"
              ? `Không có chuyên mục nào khớp với điều kiện lọc "${searchKeyword}". Hãy thử thay đổi từ khóa.`
              : "Danh sách chuyên mục đang trống. Hãy bấm nút 'Thêm Chuyên Mục Mới' để bắt đầu."
          }
          actionText={searchKeyword || statusFilter !== "all" ? "Xóa bộ lọc tìm kiếm" : "Thêm chuyên mục mới"}
          onAction={searchKeyword || statusFilter !== "all" ? handleResetFilters : handleOpenCreate}
        />
      )}

      {/* Create / Update Modal Dialog */}
      <CategoryModal
        show={modalState.show}
        mode={modalState.mode}
        category={modalState.selectedItem}
        onSave={handleSaveCategory}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal Dialog */}
      <ConfirmModal
        show={deleteConfirm.show}
        title="Xác nhận xóa chuyên mục"
        message="Bạn có chắc chắn muốn xóa chuyên mục này? Các bài viết liên kết có thể bị ảnh hưởng."
        itemName={deleteConfirm.item?.name}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

