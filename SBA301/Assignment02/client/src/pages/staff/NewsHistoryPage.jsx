/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Staff News History Page (Articles created by current staff)
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsApi from '../../api/newsApi';
import { useAuth } from '../../context/AuthContext';
import { History, Calendar, Folder, Tag as TagIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';

const NewsHistoryPage = () => {
  const { user } = useAuth();
  const [historyArticles, setHistoryArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.accountID) return;
      try {
        setLoading(true);
        const res = await newsApi.getMyHistory(user.accountID);
        if (res.success) {
          setHistoryArticles(res.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch sử bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <History className="w-4 h-4" /> Lịch sử hoạt động
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Lịch Sử Bài Viết Đã Tạo</h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách toàn bộ các tin bài do nhân viên <strong className="text-slate-700">{user?.accountName}</strong> khởi tạo
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : historyArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">Bạn chưa tạo bài viết tin tức nào trong hệ thống.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyArticles.map((item) => (
            <div
              key={item.newsArticleID}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="font-mono text-slate-500 font-semibold">#{item.newsArticleID}</span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    <Folder className="w-3 h-3" /> {item.categoryName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.createdDate ? new Date(item.createdDate).toLocaleString('vi-VN') : ''}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.newsStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.newsStatus ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {item.newsStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.newsTitle}</h3>
                {item.headline && <p className="text-sm text-slate-500 line-clamp-2">{item.headline}</p>}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((t) => (
                      <span key={t.tagID} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                        <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                        {t.tagName}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center sm:self-center">
                <Link
                  to={`/news/${item.newsArticleID}`}
                  className="px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1"
                >
                  Xem bài viết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsHistoryPage;
