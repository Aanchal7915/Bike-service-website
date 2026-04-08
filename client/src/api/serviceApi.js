import API from './axios';

export const getActiveServiceTypes = () => API.get('/admin/service-types/active');
export const createBooking = (data) => API.post('/services', data);
export const getMyBookings = () => API.get('/services/my');
export const getBooking = (id) => API.get(`/services/${id}`);
export const getAllBookings = (params) => API.get('/services', { params });
export const updateBookingStatus = (id, data) => API.put(`/services/${id}/status`, data);
export const createServicePayment = (id, data) => API.post(`/services/${id}/payment`, data);
export const verifyServicePayment = (id, data) => API.post(`/services/${id}/verify-payment`, data);
