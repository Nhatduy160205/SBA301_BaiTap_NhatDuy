import React from "react";

export const CategoryTable = ({
  categories,
  newsList = [],
  onEdit,
  onDelete
}) => {
  const getNewsCount = (catId) => {
    return newsList.filter((n) => Number(n.categoryId) === Number(catId)).length;
  };

  return (
    <div className="table-responsive rounded-4 shadow-sm border bg-body">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-uppercase text-secondary small fw-bold">
          <tr>
            <th scope="col" style={{ width: "70px" }} className="text-center">#ID</th>
            <th scope="col">Tên Chuyên Mục</th>
            <th scope="col" className="d-none d-md-table-cell">Mô Tả</th>
            <th scope="col" className="text-center">Số Bài Viết</th>
            <th scope="col" className="text-center">Trạng Thái</th>
            <th scope="col" className="d-none d-lg-table-cell">Ngày Tạo</th>
            <th scope="col" className="text-end" style={{ width: "140px" }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const count = getNewsCount(category.id);
            return (
              <tr key={category.id} className="transition-all">
                <td className="text-center fw-bold text-secondary">
                  #{category.id}
                </td>
                <td>
                  <div className="fw-bold text-body">{category.name}</div>
                  <div className="d-md-none text-secondary small">
                    {category.description || "Không có mô tả"}
                  </div>
                </td>
                <td className="d-none d-md-table-cell text-secondary small" style={{ maxWidth: "260px" }}>
                  {category.description || <em className="opacity-50">Không có mô tả</em>}
                </td>
                <td className="text-center">
                  <span className={`badge rounded-pill ${count > 0 ? "bg-info-subtle text-info border border-info-subtle" : "bg-light text-secondary border"}`}>
                    <i className="bi bi-file-earmark-text me-1"></i>
                    {count} bài viết
                  </span>
                </td>
                <td className="text-center">
                  {Number(category.status) === 1 ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-check-circle-fill me-1"></i> Active
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 rounded-pill">
                      <i className="bi bi-dash-circle-fill me-1"></i> Inactive
                    </span>
                  )}
                </td>
                <td className="d-none d-lg-table-cell text-secondary small">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa chuyên mục"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(category)}
                      title="Xóa chuyên mục"
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
