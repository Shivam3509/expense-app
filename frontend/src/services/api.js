import axios from "../axiosInstance";

const API = axios.create({
  baseURL: 'http://localhost:8000/api/', // Django backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('access');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
