import React from "react";

export const UserTable = ({
  users,
  currentUserId,
  onEdit,
  onDelete
}) => {
  return (
    <div className="table-responsive rounded-4 shadow-sm border bg-body">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-uppercase text-secondary small fw-bold">
          <tr>
            <th scope="col" style={{ width: "60px" }} className="text-center">#ID</th>
            <th scope="col">Tài Khoản (Username)</th>
            <th scope="col">Họ Và Tên</th>
            <th scope="col" className="d-none d-md-table-cell">Email</th>
            <th scope="col" className="text-center">Vai Trò (Role)</th>
            <th scope="col" className="text-center">Trạng Thái</th>
            <th scope="col" className="d-none d-lg-table-cell">Ngày Tạo</th>
            <th scope="col" className="text-end" style={{ width: "140px" }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = currentUserId && Number(user.id) === Number(currentUserId);
            const isSuperAdmin = Number(user.id) === 1;

            return (
              <tr key={user.id} className="transition-all">
                <td className="text-center fw-bold text-secondary">
                  #{user.id}
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
                        Number(user.role) === 1 ? "bg-primary" : "bg-success"
                      }`}
                      style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-bold text-body">
                        @{user.username}
                        {isCurrentUser && (
                          <span className="badge bg-primary-subtle text-primary border ms-1" style={{ fontSize: "0.65rem" }}>
                            Bạn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="fw-semibold text-body">{user.fullName || "-"}</div>
                </td>
                <td className="d-none d-md-table-cell text-secondary small">
                  <i className="bi bi-envelope me-1"></i>
                  {user.email || "-"}
                </td>
                <td className="text-center">
                  {Number(user.role) === 1 ? (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-shield-lock-fill me-1"></i> Admin (1)
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-person-badge me-1"></i> Staff (2)
                    </span>
                  )}
                </td>
                <td className="text-center">
                  {Number(user.status) === 1 ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-check-circle-fill me-1"></i> Active
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-lock-fill me-1"></i> Inactive
                    </span>
                  )}
                </td>
                <td className="d-none d-lg-table-cell text-secondary small">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => onEdit(user)}
                      title="Chỉnh sửa thông tin"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={isSuperAdmin || isCurrentUser}
                      onClick={() => onDelete(user)}
                      title={
                        isSuperAdmin
                          ? "Không thể xóa Super Admin"
                          : isCurrentUser
                          ? "Không thể tự xóa tài khoản của bạn"
                          : "Xóa tài khoản"
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
