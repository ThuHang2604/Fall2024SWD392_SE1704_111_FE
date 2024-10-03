import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';

const useAxios = () => {
  const baseURL = process.env.REACT_APP_BACKEND_API || 'http://localhost:3000';
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance, token]);

  return axiosInstance;
};

export default useAxios;
