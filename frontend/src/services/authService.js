// Authentication Service
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/profile')
      return response.data.user
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get user profile')
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data.user
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile')
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      await api.put('/auth/change-password', passwordData)
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to change password')
    }
  },

  // Verify token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Token verification failed')
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken')
    return !!token
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('authToken')
  },

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('authToken')
  }
}
