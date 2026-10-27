import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { UserTable } from "../components/users/UserTable";
import { UserModal } from "../components/users/UserModal";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { EmptyState } from "../components/common/EmptyState";
import { ToastNotification } from "../components/common/ToastNotification";

export const UserManagementPage = () => {
  const { currentUser } = useAuth();

  // Source list
  const [users, setUsers] = useState([]);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal dialog states
  const [modalState, setModalState] = useState({
    show: false,
    mode: "create",
    selectedItem: null
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
    setUsers(userService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  const handleOpenCreate = () => {
    setModalState({
      show: true,
      mode: "create",
      selectedItem: null
    });
  };

  const handleOpenEdit = (user) => {
    setModalState({
      show: true,
      mode: "update",
      selectedItem: user
    });
  };

  const handleCloseModal = () => {
    setModalState({
      show: false,
      mode: "create",
      selectedItem: null
    });
  };

  const handleSaveUser = (formData) => {
    try {
      if (modalState.mode === "create") {
        const result = userService.create(formData);
        if (result.success) {
          showToast("success", "Thành công!", `Đã tạo tài khoản @${result.user.username} thành công.`);
          loadData();
          handleCloseModal();
        } else {
          showToast("danger", "Lỗi tạo tài khoản", result.error);
        }
      } else {
        const result = userService.update(modalState.selectedItem.id, formData);
        if (result.success) {
          showToast("success", "Thành công!", `Đã cập nhật thông tin tài khoản @${result.user.username}.`);
          loadData();
          handleCloseModal();
        } else {
          showToast("danger", "Lỗi cập nhật", result.error);
        }
      }
    } catch (err) {
      showToast("danger", "Lỗi thao tác", err.message || "Không thể lưu tài khoản!");
    }
  };

  const handleOpenDelete = (user) => {
    setDeleteConfirm({
      show: true,
      item: user
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm.item) return;

    const result = userService.delete(deleteConfirm.item.id, currentUser?.id);
    if (result.success) {
      showToast("success", "Đã xóa tài khoản!", `Tài khoản @${deleteConfirm.item.username} đã được xóa.`);
      loadData();
    } else {
      showToast("warning", "Không thể xóa", result.error);
    }
    setDeleteConfirm({ show: false, item: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, item: null });
  };

  // Filtered users (does NOT mutate source list!)
  const displayedUsers = userService.search(users, searchKeyword, roleFilter, statusFilter);

  const handleResetFilters = () => {
    setSearchKeyword("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="user-management">
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-body">Quản Lý Tài Khoản & Người Dùng</h4>
          <p className="text-secondary small mb-0">
            Phân quyền quản trị viên (Admin = 1) và nhân viên biên tập (Staff = 2)
          </p>
        </div>
        <button
          type="button"
          id="btnCreateUser"
          className="btn btn-primary rounded-3 px-3 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-person-plus-fill"></i>
          Thêm Tài Khoản Mới
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
                  id="userSearchInput"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm theo username, họ tên, email..."
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

            {/* Role Filter */}
            <div className="col-6 col-md-3 col-lg-3">
              <select
                id="userRoleFilter"
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="1">Quản trị viên (Admin = 1)</option>
                <option value="2">Nhân viên (Staff = 2)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-6 col-md-2 col-lg-2">
              <select
                id="userStatusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động (Active)</option>
                <option value="0">Đã khóa (Inactive)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="col-6 col-md-2 col-lg-1">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 rounded-3"
                onClick={handleResetFilters}
                disabled={!searchKeyword && roleFilter === "all" && statusFilter === "all"}
                title="Đặt lại bộ lọc"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>

            {/* Counter */}
            <div className="col-6 col-lg-2 text-end text-secondary small">
              Hiển thị: <strong>{displayedUsers.length}</strong> / {users.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {displayedUsers.length > 0 ? (
        <UserTable
          users={displayedUsers}
          currentUserId={currentUser?.id}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <EmptyState
          icon="bi-person-x"
          title="Không tìm thấy tài khoản nào"
          description={
            searchKeyword || roleFilter !== "all" || statusFilter !== "all"
              ? "Không có tài khoản người dùng nào khớp với điều kiện lọc hiện tại."
              : "Danh sách tài khoản đang rỗng."
          }
          actionText={
            searchKeyword || roleFilter !== "all" || statusFilter !== "all"
              ? "Đặt lại bộ lọc"
              : "Thêm tài khoản mới"
          }
          onAction={
            searchKeyword || roleFilter !== "all" || statusFilter !== "all"
              ? handleResetFilters
              : handleOpenCreate
          }
        />
      )}

      {/* Create / Edit Modal Dialog */}
      <UserModal
        show={modalState.show}
        mode={modalState.mode}
        user={modalState.selectedItem}
        onSave={handleSaveUser}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal Dialog */}
      <ConfirmModal
        show={deleteConfirm.show}
        title="Xác nhận xóa tài khoản người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Tài khoản sẽ không còn quyền đăng nhập vào hệ thống."
        itemName={`@${deleteConfirm.item?.username} (${deleteConfirm.item?.fullName})`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

