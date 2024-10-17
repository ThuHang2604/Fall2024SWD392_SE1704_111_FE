import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'https://localhost:7211/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào tất cả request
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken'); // Lấy token từ Cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
