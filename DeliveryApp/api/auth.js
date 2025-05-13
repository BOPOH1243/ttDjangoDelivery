import axios from 'axios';
import { api_base_url } from './cfg';

const base = api_base_url;

export const loginApi = async (username, password) => {
  const res = await axios.post(`${base}/token/`, { username, password });
  return res.data;
};

export const refreshTokenApi = async (refresh) => {
  const res = await axios.post(`${base}/token/refresh/`, { refresh });
  return res.data;
};