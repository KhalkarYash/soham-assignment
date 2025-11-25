import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  getUser: (userId) => API.get(`/auth/user/${userId}`),
  updateProfile: (data) => API.put('/auth/profile', data),
  searchUsers: (query) => API.get(`/auth/search?query=${query}`)
};

export const postsAPI = {
  createPost: (data) => API.post('/posts', data),
  getFeed: () => API.get('/posts/feed'),
  getPost: (postId) => API.get(`/posts/${postId}`),
  likePost: (postId) => API.post(`/posts/${postId}/like`),
  addComment: (postId, data) => API.post(`/posts/${postId}/comment`, data),
  deletePost: (postId) => API.delete(`/posts/${postId}`),
  editPost: (postId, data) => API.put(`/posts/${postId}`, data),
  getUserPosts: (userId) => API.get(`/posts/user/${userId}`)
};

export const friendsAPI = {
  sendRequest: (userId) => API.post(`/friends/${userId}/request`),
  acceptRequest: (userId) => API.post(`/friends/${userId}/accept`),
  rejectRequest: (userId) => API.post(`/friends/${userId}/reject`),
  removeFriend: (userId) => API.delete(`/friends/${userId}`),
  getFriends: (userId) => API.get(`/friends/${userId}`),
  getPendingRequests: () => API.get('/friends/pending/requests')
};

export const messagesAPI = {
  sendMessage: (data) => API.post('/messages', data),
  getConversation: (userId) => API.get(`/messages/conversation/${userId}`),
  getConversations: () => API.get('/messages')
};

export const notificationsAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (notificationId) => API.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => API.put('/notifications/read/all')
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getAllUsers: () => API.get('/admin/users'),
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),
  banUser: (userId) => API.post(`/admin/users/${userId}/ban`),
  unbanUser: (userId) => API.post(`/admin/users/${userId}/unban`),
  getAllPosts: () => API.get('/admin/posts'),
  deletePostAdmin: (postId) => API.delete(`/admin/posts/${postId}`),
  getAllReports: () => API.get('/admin/reports'),
  updateReportStatus: (reportId, data) => API.put(`/admin/reports/${reportId}`, data),
  createReport: (data) => API.post('/admin/report', data)
};

export default API;
