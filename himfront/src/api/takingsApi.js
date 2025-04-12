import { api } from './api'; // Подключаем наш экземпляр axios

export const getTakings = () => api.get('/takings?status=take').then(response => response.data);
export const getTaking = (id) => api.get(`/takings/${id}`).then(response => response.data);
export const createTaking = (data) => api.post('/takings', data).then(response => response.data);
export const updateTaking = (id, data) => api.put(`/takings/${id}`, data).then(response => response.data);
export const deleteTaking = (id) => api.delete(`/takings/${id}`).then(response => response.data);
