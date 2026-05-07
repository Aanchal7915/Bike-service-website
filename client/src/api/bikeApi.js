import API from './axios';

export const getBikes = (params) => API.get('/bikes', { params });
export const getBike = (id) => API.get(`/bikes/${id}`);
export const getFeaturedBikes = (params) => API.get('/bikes/featured', { params });
export const getBestsellerBikes = (params) => API.get('/bikes/bestseller', { params });
export const createBike = (data) => API.post('/bikes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBike = (id, data) => API.put(`/bikes/${id}`, data);
export const deleteBike = (id) => API.delete(`/bikes/${id}`);
export const enquireBike = (id, data) => API.post(`/bikes/${id}/enquire`, data);
export const getMyEnquiries = () => API.get('/bikes/my-enquiries');
export const approveBike = (id) => API.put(`/admin/bikes/${id}/approve`);
