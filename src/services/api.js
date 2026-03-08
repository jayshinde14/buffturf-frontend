import axios from 'axios';

const API = axios.create({
    baseURL: 'https://buffturf-backend.onrender.com'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);

// TURFS
export const getAllTurfs = () => API.get('/api/turfs/search');
export const searchTurfs = (location, sportType) => {
    let url = '/api/turfs/search';
    const params = [];
    if (location && location.trim() !== '')
        params.push(`location=${location}`);
    if (sportType && sportType.trim() !== '')
        params.push(`sportType=${sportType}`);
    if (params.length > 0) url += '?' + params.join('&');
    return API.get(url);
};
export const getTurfById = (id) => API.get(`/api/turfs/${id}`);

// SLOTS
export const getSlotsByTurfAndDate = (turfId, date) =>
    API.get(`/api/turfs/${turfId}/slots?date=${date}`);

// BOOKINGS
export const createBooking = (data) => API.post('/api/bookings', data);
export const getMyBookings = () => API.get('/api/bookings/my');
export const cancelBooking = (id) => API.put(`/api/bookings/${id}/cancel`);
export const verifyBooking = (code) =>
    API.get(`/api/bookings/verify/${code}`);

// ADMIN
export const getDashboardStats = () => API.get('/api/admin/dashboard');
export const getAllBookings = () => API.get('/api/admin/bookings');
export const getTodayBookings = () => API.get('/api/admin/bookings/today');
export const getAllUsers = () => API.get('/api/admin/users');
export const addTurf = (data) => API.post('/api/admin/turfs', data);
export const updateTurf = (id, data) =>
    API.put(`/api/admin/turfs/${id}`, data);
export const deleteTurf = (id) => API.delete(`/api/admin/turfs/${id}`);
export const generateSlots = (turfId, date) =>
    API.post(`/api/admin/turfs/${turfId}/slots/generate?date=${date}`);
export const adminCancelBooking = (id) =>
    API.put(`/api/admin/bookings/${id}/cancel`);