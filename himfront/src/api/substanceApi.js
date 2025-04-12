import { api } from './api';

export const getSubstances = () => api.get('/inventory/substances').then(res => res.data);
export const getSubstance = (id) => api.get(`/inventory/substances/${id}`).then(res => res.data);
export const createSubstance = (data) => api.post('/inventory/substances', data).then(res => res.data);
export const updateSubstance = (id, data) => api.put(`/inventory/substances/${id}`, data).then(res => res.data);
export const deleteSubstance = (id) => api.delete(`/inventory/substances/${id}`).then(res => res.data);
