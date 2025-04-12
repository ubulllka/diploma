import { api } from './api';

export const getResources = (filters = {}) => {
    const {
        name = '',
        category_id = '',
        substance_id = '',
        status = '',
    } = filters;

    const query = `/inventory/resources?name=${encodeURIComponent(name)}&category_id=${encodeURIComponent(category_id)}&substance_id=${encodeURIComponent(substance_id)}&status=${encodeURIComponent(status)}`;

    return api.get(query).then(res => res.data);
};

export const getResource = (id) => api.get(`/inventory/resources/${id}`).then(response => response.data);
export const createResource = (data) => api.post('/inventory/resources', data).then(response => response.data);
export const updateResource = (id, data) => api.put(`/inventory/resources/${id}`, data).then(response => response.data);
export const deleteResource = (id) => api.delete(`/inventory/resources/${id}`).then(response => response.data);

export const subResource = (id, data) => api.put(`/inventory/resources/${id}/sub`, data).then(response => response.data);