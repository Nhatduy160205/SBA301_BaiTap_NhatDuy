/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Axios Client Config
 */
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor để trích xuất data
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const res = error.response;
    const message = res?.data?.message || error.message || 'Đã có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
