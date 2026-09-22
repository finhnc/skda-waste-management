import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = "Bearer " + token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;