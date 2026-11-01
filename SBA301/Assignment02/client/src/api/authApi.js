/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Auth API Service
 */
import axiosClient from './axiosClient';

const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
};

export default authApi;
