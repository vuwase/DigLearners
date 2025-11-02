// Authentication Service
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

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
    // Don't redirect on 401 if we're already on login page or during login attempts
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/login/'
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    
    if (error.response?.status === 401 && !isLoginPage && !isLoginRequest) {
      console.log('[authService] 401 error - redirecting to login', {
        pathname: window.location.pathname,
        url: error.config?.url
      })
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
      console.log('[authService] Login attempt:', { 
        email: credentials.email, 
        loginType: credentials.loginType 
      })
      console.log('[authService] Making request to:', API_BASE_URL + '/auth/login')
      
      const response = await api.post('/auth/login', credentials)
      console.log('[authService] Login response received:', {
        success: response.data?.success,
        hasUser: !!response.data?.user,
        hasToken: !!response.data?.token,
        message: response.data?.message
      })
      
      if (!response.data) {
        console.error('[authService] ERROR: No data in response!')
        throw new Error('No response data received from server')
      }
      
      return response.data
    } catch (error) {
      console.error('[authService] Login error caught:', error)
      console.error('[authService] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        config: error.config
      })
      
      let errorMessage = 'Login failed'
      let errorType = 'unknown_error'
      
      // Handle network errors
      if (!error.response) {
        console.error('[authService] Network error - no response from server')
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Connection timeout. Please check your internet connection and try again.'
          errorType = 'timeout_error'
        } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and ensure the backend is running on ' + API_BASE_URL
          errorType = 'network_error'
        } else {
          errorMessage = 'Unable to connect to server. Please check if the backend is running on ' + API_BASE_URL
          errorType = 'connection_error'
        }
      } else {
        // Handle API response errors
        console.error('[authService] API error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        })
        
        const errorData = error.response?.data
        errorMessage = errorData?.error || `Login failed (Status: ${error.response.status})`
        errorType = errorData?.errorType || 'api_error'
      }
      
      // Create enhanced error object with specific details
      const enhancedError = new Error(errorMessage)
      enhancedError.type = errorType
      enhancedError.status = error.response?.status
      enhancedError.originalError = error
      
      console.error('[authService] Throwing enhanced error:', {
        message: enhancedError.message,
        type: enhancedError.type,
        status: enhancedError.status
      })
      
      throw enhancedError
    }
  },

  // Register user
  async register(userData) {
    try {
      console.log('Registration attempt:', { ...userData, password: '***' })
      const response = await api.post('/auth/register', userData)
      console.log('Registration response:', response.data)
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed'
      
      // Handle network errors
      if (!error.response) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Connection timeout. Please check your internet connection and try again.'
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
        } else {
          errorMessage = 'Unable to connect to server. Please check if the backend is running on ' + API_BASE_URL
        }
      } else {
        // Handle API response errors
        const errorData = error.response?.data
        errorMessage = errorData?.error || `Registration failed (Status: ${error.response.status})`
        
        // Add more context for common errors
        if (error.response.status === 400) {
          errorMessage = errorData?.error || 'Invalid registration data. Please check your information.'
        } else if (error.response.status === 409 || errorData?.error?.includes('already exists')) {
          errorMessage = errorData?.error || 'An account with this email already exists. Please login instead.'
        } else if (error.response.status === 500) {
          errorMessage = errorData?.error || 'Server error during registration. Please try again later.'
        }
      }
      
      const enhancedError = new Error(errorMessage)
      enhancedError.status = error.response?.status
      enhancedError.data = error.response?.data
      throw enhancedError
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
