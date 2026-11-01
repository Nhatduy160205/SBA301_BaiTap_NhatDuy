/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Public News List Page (Unauthenticated / Active Articles Only)
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsApi from '../../api/newsApi';
import { Search, Calendar, Tag as TagIcon, Folder, User, ArrowRight } from 'lucide-react';

const PublicNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (query = '') => {
    try {
      setLoading(true);
      const res = await newsApi.getPublic(query);
      if (res.success) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải tin tức:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles(keyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner & Search Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10">
        <div className="max-w-3xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
            Bản Tin & Sự Kiện FPT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Cổng Thông Tin Tin Tức Trường Đại Học FPT
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-8">
            Cập nhật những tin tức giáo dục, công nghệ, nghiên cứu và hoạt động sinh viên mới nhất mỗi ngày.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-inner">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-white/60 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
            >
              Tìm Kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-slate-800">
          Tin Mới Xuất Bản <span className="text-slate-400 font-normal text-sm">({articles.length} bài viết)</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">Không tìm thấy bài viết tin tức nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <div
              key={item.newsArticleID}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Category & Date */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    <Folder className="w-3.5 h-3.5" />
                    {item.categoryName || 'Chung'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : 'Mới'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link to={`/news/${item.newsArticleID}`}>
                    {item.newsTitle}
                  </Link>
                </h3>

                {/* Headline */}
                {item.headline && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">
                    {item.headline}
                  </p>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                    {item.tags.map((t) => (
                      <span
                        key={t.tagID}
                        className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                        {t.tagName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author & Read More Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {item.createdByName || 'Ban Biên Tập'}
                  </span>
                  <Link
                    to={`/news/${item.newsArticleID}`}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicNewsPage;
