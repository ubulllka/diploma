import { api } from './api';

export const getMeasurements = () => api.get('/inventory/measurements').then(res => res.data);
export const getMeasurement = (id) => api.get(`/inventory/measurements/${id}`).then(res => res.data);
export const createMeasurement = (data) => api.post('/inventory/measurements', data).then(res => res.data);
export const updateMeasurement = (id, data) => api.put(`/inventory/measurements/${id}`, data).then(res => res.data);
export const deleteMeasurement = (id) => api.delete(`/inventory/measurements/${id}`).then(res => res.data);
