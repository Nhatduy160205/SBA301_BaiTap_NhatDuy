/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Tag API Service
 */
import axiosClient from './axiosClient';

const tagApi = {
  getAll: () => axiosClient.get('/tags'),
};

export default tagApi;
