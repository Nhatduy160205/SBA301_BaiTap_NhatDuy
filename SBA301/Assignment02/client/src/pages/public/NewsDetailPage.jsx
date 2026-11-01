/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * News Article Detail Page
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import newsApi from '../../api/newsApi';
import { Calendar, User, Folder, Tag as TagIcon, ArrowLeft, Globe } from 'lucide-react';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await newsApi.getPublicById(id);
        if (res.success) {
          setArticle(res.data);
        }
      } catch (err) {
        setError(err.message || 'Không tìm thấy bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || "Không tìm thấy bài viết"}</h2>
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách tin tức
      </Link>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <span className="flex items-center gap-1.5 font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Folder className="w-3.5 h-3.5" />
            {article.categoryName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(article.createdDate).toLocaleString('vi-VN')}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Tác giả: <strong className="text-slate-700">{article.createdByName}</strong>
          </span>
          {article.newsSource && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Nguồn: {article.newsSource}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
          {article.newsTitle}
        </h1>

        {/* Headline */}
        {article.headline && (
          <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl mb-8">
            <p className="text-slate-700 font-medium italic text-base leading-relaxed">
              {article.headline}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none text-slate-800 leading-relaxed text-base space-y-4 whitespace-pre-line mb-10">
          {article.newsContent}
        </div>

        {/* Tags Footer */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Từ khóa bài viết:</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span
                  key={t.tagID}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1.5"
                >
                  <TagIcon className="w-3 h-3 text-slate-400" />
                  {t.tagName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default NewsDetailPage;
