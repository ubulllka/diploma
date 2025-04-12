import {api} from "./api.js";

export const getUsages = (tId) => api.get(`/takings/${tId}/usages`).then(res => res.data);
export const getUsage = (tId,id) => api.get(`/takings/${tId}/usages/${id}`).then(res => res.data);
export const createUsage = (tId,data) => api.post(`/takings/${tId}/usages`, data).then(res => res.data);
export const updateUsage = (tId, id, data) => api.put(`/takings/${tId}/usages/${id}`, data).then(res => res.data);
export const deleteUsage = (tId, id) => api.delete(`/takings/${tId}/usages/${id}`).then(res => res.data);