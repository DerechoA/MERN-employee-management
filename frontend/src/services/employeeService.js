import api from '../config/api';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getFormDefinition = (token) => api.get('/definitions/employees', getAuthHeaders(token));
export const getEmployees = (token) => api.get('/employees', getAuthHeaders(token));
export const getDeletedEmployees = (token) => api.get('/employees?deleted=true', getAuthHeaders(token));
export const createEmployee = (token, payload) => api.post('/employees', payload, getAuthHeaders(token));
export const updateEmployee = (token, id, payload) => api.put(`/employees/${id}`, payload, getAuthHeaders(token));
export const deleteEmployee = (token, id) => api.delete(`/employees/${id}`, getAuthHeaders(token));
export const undeleteEmployee = (token, id) => api.patch(`/employees/${id}/undelete`, {}, getAuthHeaders(token));
export const permanentDeleteEmployee = (token, id) => api.delete(`/employees/${id}/permanent`, getAuthHeaders(token));
