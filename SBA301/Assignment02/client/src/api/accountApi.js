/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Account API Service
 */
import axiosClient from './axiosClient';

const accountApi = {
  getAll: (keyword) => axiosClient.get('/accounts', { params: { keyword } }),
  getById: (id) => axiosClient.get(`/accounts/${id}`),
  create: (data) => axiosClient.post('/accounts', data),
  update: (id, data) => axiosClient.put(`/accounts/${id}`, data),
  delete: (id) => axiosClient.delete(`/accounts/${id}`),
  updateProfile: (id, data) => axiosClient.put(`/accounts/${id}/profile`, data),
};

export default accountApi;
