/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * News Article API Service
 */
import axiosClient from './axiosClient';

const newsApi = {
  getPublic: (keyword) => axiosClient.get('/news/public', { params: { keyword } }),
  getPublicById: (id) => axiosClient.get(`/news/public/${id}`),
  getAll: (keyword) => axiosClient.get('/news', { params: { keyword } }),
  getMyHistory: (staffId) => axiosClient.get('/news/history', { params: { staffId } }),
  getById: (id) => axiosClient.get(`/news/${id}`),
  create: (data) => axiosClient.post('/news', data),
  update: (id, data) => axiosClient.put(`/news/${id}`, data),
  delete: (id) => axiosClient.delete(`/news/${id}`),
};

export default newsApi;
