import axios from 'axios';

// Create axios instance
const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.success) {
    // Save token to localStorage
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.success) {
    // Save token to localStorage
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  try {
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data.data.user;
  } catch (error) {
    // If token is invalid, remove it
    localStorage.removeItem('token');
    return null;
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;