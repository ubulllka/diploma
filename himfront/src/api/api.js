import axios from 'axios';
import {AUTH_STORAGE_KEY} from '../constants/auth';

export const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'http://193.124.33.206:8080',
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(config => {
    const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (authData?.token) {
        config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
});

// Обработка ошибок
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response.status === 403) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);