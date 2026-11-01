/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Application Navbar
 */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Newspaper, Users, FolderTree, History, UserCheck, LogIn, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 text-blue-600 font-extrabold text-xl tracking-tight">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
                <Newspaper className="w-5 h-5" />
              </div>
              <span>FUNews<span className="text-slate-800">System</span></span>
            </Link>

            {/* Menu Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Trang Tin Tức
              </Link>

              {/* Menu cho Admin (Role 1) */}
              {isAdmin && (
                <Link
                  to="/admin/accounts"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive('/admin/accounts') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Quản lý Tài Khoản
                </Link>
              )}

              {/* Menu Quản lý Danh mục & Tin tức (Dành cho cả Admin và Staff) */}
              {(isAdmin || isStaff) && (
                <>
                  <Link
                    to="/staff/categories"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive('/staff/categories') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FolderTree className="w-4 h-4" />
                    Quản lý Danh Mục
                  </Link>
                  <Link
                    to="/staff/news"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive('/staff/news') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Quản lý Tin Tức
                  </Link>
                </>
              )}

              {/* Menu Lịch sử & Hồ sơ */}
              {user && (
                <>
                  <Link
                    to="/staff/history"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive('/staff/history') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    Lịch Sử Viết Tin
                  </Link>
                  <Link
                    to="/staff/profile"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive('/staff/profile') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Hồ Sơ Cá Nhân
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-800 leading-tight">{user.accountName}</div>
                  <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                    isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isAdmin ? 'Quản Trị Viên (Admin)' : 'Nhân Viên (Staff)'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
