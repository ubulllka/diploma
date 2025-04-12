import { api } from './api';

// Запросы для работы с профилем
export const getMyProfile = () => api.get(`/me`).then(response => response.data);
export const postMyProfile = (data) => api.post(`/me`, data).then(response => response.data);

export const getUsers = () => api.get(`/users`).then(response => response.data);

export const updateUserStatus = (id, status) =>
    api.post(`/users/${id}/status`, { status }).then(response => response.data);

export const updateUserRole = (id, role) =>
    api.post(`/users/${id}/role`, { role }).then(response => response.data);
