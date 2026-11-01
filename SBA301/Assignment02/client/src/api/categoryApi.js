/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Category API Service
 */
import axiosClient from './axiosClient';

const categoryApi = {
  getAll: (keyword, activeOnly = false) => 
    axiosClient.get('/categories', { params: { keyword, activeOnly } }),
  getById: (id) => axiosClient.get(`/categories/${id}`),
  create: (data) => axiosClient.post('/categories', data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryApi;
