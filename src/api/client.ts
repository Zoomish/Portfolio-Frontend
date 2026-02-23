import axios from 'axios';

const BASE_URL = 'https://portfolio-backend-3fya.onrender.com/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
});
