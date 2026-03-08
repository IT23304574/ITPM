import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
// Attach JWT from stored user to every request
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerStudent = (data) => API.post('/auth/admin/register', data);
export const getAllStudents = () => API.get('/auth/students');
export const adminUpdateStudentPassword = (data) => API.put('/auth/admin/update-password', data);
export const changePassword = (data) => API.post('/auth/change-password', data);
export const createTrip = (data) => API.post('/trips/create', data);
export const joinTrip = (data) => API.post('/trips/join', data);
export const getTrips = () => API.get('/trips');
export const deleteTrip = (tripId) => API.delete(`/trips/${tripId}`);
export const startTrip = (tripId) => API.put(`/trips/${tripId}/start`);

export default API;