import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storageService } from "../services/storageService";
import { useAuth } from "../context/AuthContext";
import { NewsDetailModal } from "../components/news/NewsDetailModal";

export const DashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    setCategories(storageService.getCategories());
    setNewsList(storageService.getNews());
    setUsers(storageService.getUsers());
  }, []);

  // Aggregated metrics
  const totalNews = newsList.length;
  const activeNews = newsList.filter((n) => Number(n.status) === 1).length;
  const inactiveNews = totalNews - activeNews;

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => Number(c.status) === 1).length;

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => Number(u.role) === 1).length;
  const staffUsers = totalUsers - adminUsers;

  // Recent news (latest 4)
  const recentNews = [...newsList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const getCategoryName = (catId) => {
    const c = categories.find((item) => Number(item.id) === Number(catId));
    return c ? c.name : `Chuyên mục #${catId}`;
  };

  return (
    <div className="dashboard-page">
      {/* Modern Hero Welcome Banner with Teal & Indigo Gradient */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-gradient-primary text-white p-4 p-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="badge bg-white text-dark mb-3 px-3 py-2 rounded-pill fw-semibold shadow-sm">
              <i className="bi bi-stars text-warning me-1"></i> Bảng Điều Khiển Tổng Quan • SBA301
            </div>
            <h2 className="fw-bold mb-2">
              Xin chào, {currentUser?.fullName || currentUser?.username}! 👋
            </h2>
            <p className="mb-0 opacity-90 fs-6" style={{ maxWidth: "600px" }}>
              Cổng thông tin FUNewsManagementSystem đang hoạt động ổn định. Bạn đang đăng nhập với vai trò <span className="badge bg-dark bg-opacity-50 px-2 py-1">{currentUser?.roleName}</span>.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/news" className="btn btn-light text-dark fw-bold rounded-3 shadow-sm px-3 py-2">
              <i className="bi bi-pencil-square text-success me-1"></i> Soạn Tin Tức
            </Link>
            <Link to="/categories" className="btn btn-outline-light fw-semibold rounded-3 px-3 py-2">
              <i className="bi bi-folder-plus me-1"></i> Thêm Chuyên Mục
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        {/* Total News */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card metric-card border-0 shadow-sm rounded-4 h-100 bg-body">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold text-uppercase">Tổng Tin Tức</span>
                <h2 className="fw-bold text-body mt-2 mb-1">{totalNews}</h2>
                <div className="small text-success">
                  <i className="bi bi-check2-circle me-1"></i> {activeNews} xuất bản • {inactiveNews} nháp
                </div>
              </div>
              <div className="metric-icon-box bg-teal-subtle text-success p-3">
                <i className="bi bi-newspaper"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card metric-card border-0 shadow-sm rounded-4 h-100 bg-body">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold text-uppercase">Chuyên Mục</span>
                <h2 className="fw-bold text-body mt-2 mb-1">{totalCategories}</h2>
                <div className="small text-primary">
                  <i className="bi bi-folder-check me-1"></i> {activeCategories} đang hoạt động
                </div>
              </div>
              <div className="metric-icon-box bg-primary-subtle text-primary p-3">
                <i className="bi bi-collection-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card metric-card border-0 shadow-sm rounded-4 h-100 bg-body">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold text-uppercase">Tài Khoản</span>
                <h2 className="fw-bold text-body mt-2 mb-1">{totalUsers}</h2>
                <div className="small text-secondary">
                  <i className="bi bi-people-fill me-1"></i> {adminUsers} Admin • {staffUsers} Staff
                </div>
              </div>
              <div className="metric-icon-box bg-indigo-subtle text-indigo p-3" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card metric-card border-0 shadow-sm rounded-4 h-100 bg-body">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold text-uppercase">Trạng Thái Hệ Thống</span>
                <h5 className="fw-bold text-success mt-2 mb-1">
                  <i className="bi bi-shield-check me-1"></i> Trực Tuyến
                </h5>
                <div className="small text-secondary">
                  React 19 • Local Storage SPA
                </div>
              </div>
              <div className="metric-icon-box bg-warning-subtle text-warning p-3">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Recent News Articles */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-body h-100">
            <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0 text-body">Bài Viết Mới Xuất Bản</h5>
                <small className="text-secondary">Các bài viết mới nhất được biên tập trên hệ thống</small>
              </div>
              <Link to="/news" className="btn btn-sm btn-outline-secondary rounded-3">
                Xem tất cả ({totalNews}) <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="list-group list-group-flush gap-2">
                {recentNews.map((item) => (
                  <div
                    key={item.id}
                    className="list-group-item list-group-item-action border rounded-3 p-3 transition-all cursor-pointer"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                      <h6 className="fw-bold mb-0 text-body text-truncate">
                        {item.title}
                      </h6>
                      <span className="badge bg-teal-subtle text-success rounded-pill flex-shrink-0">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </div>
                    <p className="text-secondary small text-truncate mb-2" style={{ maxWidth: "540px" }}>
                      {item.content}
                    </p>
                    <div className="d-flex align-items-center justify-content-between text-secondary small">
                      <span>
                        <i className="bi bi-person-circle me-1"></i> {item.createdBy || "Admin"}
                      </span>
                      <span>
                        <i className="bi bi-clock me-1"></i>{" "}
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-body h-100">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0 text-body">Phân Bố Chuyên Mục</h5>
              <small className="text-secondary">Tỷ trọng bài viết theo từng nhóm tin tức</small>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="d-flex flex-column gap-3">
                {categories.map((cat) => {
                  const count = newsList.filter((n) => Number(n.categoryId) === Number(cat.id)).length;
                  const percentage = totalNews > 0 ? Math.round((count / totalNews) * 100) : 0;
                  return (
                    <div key={cat.id}>
                      <div className="d-flex justify-content-between align-items-center mb-1 small">
                        <span className="fw-semibold text-body text-truncate" style={{ maxWidth: "180px" }}>
                          {cat.name}
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill">
                          {count} bài ({percentage}%)
                        </span>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${percentage}%`,
                            background: "linear-gradient(90deg, #0d9488, #6366f1)"
                          }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-top">
                <Link to="/categories" className="btn btn-outline-secondary w-100 rounded-3 btn-sm">
                  <i className="bi bi-folder2-open me-1"></i> Quản lý danh mục
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          show={Boolean(selectedNews)}
          newsItem={selectedNews}
          categoryName={getCategoryName(selectedNews.categoryId)}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
