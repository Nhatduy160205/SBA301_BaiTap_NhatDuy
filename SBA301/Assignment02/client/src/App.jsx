/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * App Root Component with Routing
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import PublicNewsPage from './pages/public/PublicNewsPage';
import NewsDetailPage from './pages/public/NewsDetailPage';
import LoginPage from './pages/auth/LoginPage';
import AccountManagementPage from './pages/admin/AccountManagementPage';
import CategoryManagementPage from './pages/staff/CategoryManagementPage';
import NewsManagementPage from './pages/staff/NewsManagementPage';
import NewsHistoryPage from './pages/staff/NewsHistoryPage';
import StaffProfilePage from './pages/staff/StaffProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicNewsPage />} />
              <Route path="/news" element={<PublicNewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Admin Routes (Role 1) */}
              <Route
                path="/admin/accounts"
                element={
                  <ProtectedRoute allowedRoles={[1]}>
                    <AccountManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Categories & News Routes (Dành cho cả Admin và Staff) */}
              <Route
                path="/staff/categories"
                element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/news"
                element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    <NewsManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/history"
                element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    <NewsHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/profile"
                element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    <StaffProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer with Student Author Info */}
          <footer className="bg-white border-t border-slate-200 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">FUNews Management System — Assignment 02 SBA301</p>
              <p>Sinh viên thực hiện: <span className="font-semibold text-blue-600">Trần Nhật Duy</span> — MSSV: <span className="font-semibold text-blue-600">CE190982</span></p>
              <p className="text-[11px] text-slate-400">© 2026 FPT University. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
