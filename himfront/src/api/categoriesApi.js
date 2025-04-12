import { api } from './api'; // Подключаем наш экземпляр axios

export const getCategories = () => api.get('/inventory/categories').then(res => res.data);
export const getCategory = (id) => api.get(`/inventory/categories/${id}`).then(res => res.data);
export const createCategory = (data) => api.post('/inventory/categories', data).then(res => res.data);
export const updateCategory = (id, data) => api.put(`/inventory/categories/${id}`, data).then(res => res.data);
export const deleteCategory = (id) => api.delete(`/inventory/categories/${id}`).then(res => res.data);
