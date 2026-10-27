import React, { useState, useEffect } from "react";
import { newsService } from "../services/newsService";
import { categoryService } from "../services/categoryService";
import { useAuth } from "../context/AuthContext";
import { NewsTable } from "../components/news/NewsTable";
import { NewsModal } from "../components/news/NewsModal";
import { NewsDetailModal } from "../components/news/NewsDetailModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { EmptyState } from "../components/common/EmptyState";
import { ToastNotification } from "../components/common/ToastNotification";

export const NewsManagementPage = () => {
  const { currentUser } = useAuth();

  // Source data
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [modalState, setModalState] = useState({
    show: false,
    mode: "create", // "create" | "update"
    selectedItem: null
  });

  const [detailModal, setDetailModal] = useState({
    show: false,
    item: null
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    item: null
  });

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  const loadData = () => {
    setNewsList(newsService.getAll());
    setCategories(categoryService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setModalState({
      show: true,
      mode: "create",
      selectedItem: null
    });
  };

  // Open Edit Dialog
  const handleOpenEdit = (item) => {
    setModalState({
      show: true,
      mode: "update",
      selectedItem: item
    });
  };

  // Close Create/Edit Dialog
  const handleCloseModal = () => {
    setModalState({
      show: false,
      mode: "create",
      selectedItem: null
    });
  };

  // Open Detail View Modal
  const handleOpenDetail = (item) => {
    setDetailModal({
      show: true,
      item
    });
  };

  // Save (Create or Update)
  const handleSaveNews = (formData) => {
    try {
      if (modalState.mode === "create") {
        const created = newsService.create({
          ...formData,
          createdBy: currentUser?.username || "Admin"
        });
        showToast("success", "Thành công!", `Đã xuất bản bài viết "${created.title}" thành công.`);
      } else {
        const updated = newsService.update(modalState.selectedItem.id, formData);
        showToast("success", "Thành công!", `Đã cập nhật bài viết "${updated.title}" thành công.`);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      showToast("danger", "Lỗi thao tác", err.message || "Không thể lưu bài viết!");
    }
  };

  // Open Delete Confirm
  const handleOpenDelete = (item) => {
    setDeleteConfirm({
      show: true,
      item
    });
  };

  // Confirm Delete Execution
  const handleConfirmDelete = () => {
    if (!deleteConfirm.item) return;

    const result = newsService.delete(deleteConfirm.item.id);
    if (result.success) {
      showToast("success", "Đã xóa bài viết!", `Bài viết "${deleteConfirm.item.title}" đã được xóa khỏi hệ thống.`);
      loadData();
    } else {
      showToast("danger", "Lỗi xóa", "Không thể xóa bài viết này!");
    }
    setDeleteConfirm({ show: false, item: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, item: null });
  };

  // Filtered List (does NOT mutate source list!)
  const displayedNews = newsService.search(
    newsList,
    searchKeyword,
    categoryFilter,
    statusFilter
  );

  const handleResetFilters = () => {
    setSearchKeyword("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const getCategoryName = (catId) => {
    const found = categories.find((c) => Number(c.id) === Number(catId));
    return found ? found.name : `Chuyên mục #${catId}`;
  };

  return (
    <div className="news-management">
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-body">Quản Lý Tin Tức & Bài Viết</h4>
          <p className="text-secondary small mb-0">
            Biên tập, phân loại theo chuyên mục, xuất bản và tìm kiếm bài viết
          </p>
        </div>
        <button
          type="button"
          id="btnCreateNews"
          className="btn btn-primary rounded-3 px-3 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-pencil-square"></i>
          Soạn Bài Viết Mới
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-body">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-5 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary border-end-0">
                  <i className="bi bi-search text-secondary"></i>
                </span>
                <input
                  type="text"
                  id="newsSearchInput"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm theo tiêu đề, nội dung, thẻ tags..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearchKeyword("")}
                    title="Xóa tìm kiếm"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-6 col-md-3 col-lg-3">
              <select
                id="newsCategoryFilter"
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất cả chuyên mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-6 col-md-2 col-lg-2">
              <select
                id="newsStatusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Xuất bản (Active)</option>
                <option value="0">Bản nháp (Inactive)</option>
              </select>
            </div>

            {/* Reset button */}
            <div className="col-6 col-md-2 col-lg-1">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 rounded-3"
                onClick={handleResetFilters}
                disabled={!searchKeyword && categoryFilter === "all" && statusFilter === "all"}
                title="Đặt lại bộ lọc"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>

            {/* Count */}
            <div className="col-6 col-lg-2 text-end text-secondary small">
              Hiển thị: <strong>{displayedNews.length}</strong> / {newsList.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {displayedNews.length > 0 ? (
        <NewsTable
          newsList={displayedNews}
          categories={categories}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <EmptyState
          icon="bi-file-earmark-x"
          title="Không tìm thấy bài viết nào"
          description={
            searchKeyword || categoryFilter !== "all" || statusFilter !== "all"
              ? "Không có bài viết nào khớp với điều kiện lọc hiện tại. Vui lòng thử tìm từ khóa khác."
              : "Chưa có bài viết tin tức nào được tạo trong hệ thống. Hãy soạn bài viết đầu tiên ngay!"
          }
          actionText={
            searchKeyword || categoryFilter !== "all" || statusFilter !== "all"
              ? "Đặt lại bộ lọc"
              : "Soạn bài viết mới"
          }
          onAction={
            searchKeyword || categoryFilter !== "all" || statusFilter !== "all"
              ? handleResetFilters
              : handleOpenCreate
          }
        />
      )}

      {/* Create / Edit Popup Modal */}
      <NewsModal
        show={modalState.show}
        mode={modalState.mode}
        newsItem={modalState.selectedItem}
        categories={categories}
        currentUser={currentUser}
        onSave={handleSaveNews}
        onClose={handleCloseModal}
      />

      {/* Article Detail View Modal */}
      <NewsDetailModal
        show={detailModal.show}
        newsItem={detailModal.item}
        categoryName={detailModal.item ? getCategoryName(detailModal.item.categoryId) : ""}
        onClose={() => setDetailModal({ show: false, item: null })}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteConfirm.show}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Bài viết sẽ bị gỡ bỏ vĩnh viễn khỏi cổng thông tin."
        itemName={deleteConfirm.item?.title}
        confirmText="Xóa bài viết"
        cancelText="Hủy bỏ"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

