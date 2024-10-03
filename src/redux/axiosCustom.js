import axios from 'axios';

const instance = axios.create({
  // baseURL: process.env.REACT_APP_BACKEND_API || 'https://localhost:7211',
  baseURL: 'https://localhost:7211/',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default instance;
