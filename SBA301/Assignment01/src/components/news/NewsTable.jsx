import React from "react";

export const NewsTable = ({
  newsList,
  categories = [],
  onView,
  onEdit,
  onDelete
}) => {
  const getCategoryName = (catId) => {
    const found = categories.find((c) => Number(c.id) === Number(catId));
    return found ? found.name : `Chuyên mục #${catId}`;
  };

  return (
    <div className="table-responsive rounded-4 shadow-sm border bg-body">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-uppercase text-secondary small fw-bold">
          <tr>
            <th scope="col" style={{ width: "60px" }} className="text-center">#ID</th>
            <th scope="col">Tiêu Đề Bài Viết</th>
            <th scope="col">Chuyên Mục</th>
            <th scope="col" className="d-none d-md-table-cell">Tác Giả</th>
            <th scope="col" className="d-none d-lg-table-cell">Thẻ (Tags)</th>
            <th scope="col" className="text-center">Trạng Thái</th>
            <th scope="col" className="d-none d-xl-table-cell">Ngày Tạo</th>
            <th scope="col" className="text-end" style={{ width: "160px" }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((item) => (
            <tr key={item.id} className="transition-all">
              <td className="text-center fw-bold text-secondary">
                #{item.id}
              </td>
              <td>
                <div
                  className="fw-bold text-body hover-text-primary cursor-pointer text-truncate"
                  style={{ maxWidth: "320px" }}
                  onClick={() => onView(item)}
                  title="Bấm để xem chi tiết bài viết"
                >
                  {item.title}
                </div>
                <div className="text-secondary small d-none d-sm-block text-truncate" style={{ maxWidth: "320px" }}>
                  {item.content}
                </div>
              </td>
              <td>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1">
                  <i className="bi bi-folder2 me-1"></i>
                  {getCategoryName(item.categoryId)}
                </span>
              </td>
              <td className="d-none d-md-table-cell small">
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-person text-secondary"></i>
                  <span>{item.createdBy || "Admin"}</span>
                </div>
              </td>
              <td className="d-none d-lg-table-cell">
                <div className="d-flex flex-wrap gap-1" style={{ maxWidth: "180px" }}>
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: "0.7rem" }}>
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted small">-</span>
                  )}
                  {item.tags && item.tags.length > 2 && (
                    <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: "0.7rem" }}>
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="text-center">
                {Number(item.status) === 1 ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                    <i className="bi bi-check-circle-fill me-1"></i> Xuất bản
                  </span>
                ) : (
                  <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 rounded-pill">
                    <i className="bi bi-clock-history me-1"></i> Bản nháp
                  </span>
                )}
              </td>
              <td className="d-none d-xl-table-cell text-secondary small">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={() => onView(item)}
                    title="Xem chi tiết"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => onEdit(item)}
                    title="Chỉnh sửa bài viết"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(item)}
                    title="Xóa bài viết"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
