import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_base_url } from './cfg';

const api = axios.create({
  baseURL: api_base_url,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refresh');
        const res = await axios.post(`${api_base_url}/token/refresh/`, { refresh });
        await AsyncStorage.setItem('access', res.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (e) {
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');
      }
    }
    return Promise.reject(err);
  }
);

export default api;