// API Service - Centralized API calls
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

// Response interceptor to handle errors
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

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Backend connection failed')
  }
}

// Test endpoint
export const testConnection = async () => {
  try {
    const response = await api.get('/test')
    return response.data
  } catch (error) {
    throw new Error('Backend test failed')
  }
}

export default api

export const apiService = {
  // Content Management API
  content: {
    // Get all lessons
    async getLessons(params = {}) {
      try {
        const response = await api.get('/content/lessons', { params })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch lessons')
      }
    },

    // Get lesson by ID
    async getLesson(id) {
      try {
        const response = await api.get(`/content/lessons/${id}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch lesson')
      }
    },

    // Create lesson (Admin)
    async createLesson(lessonData) {
      try {
        const response = await api.post('/content/lessons', lessonData)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create lesson')
      }
    },

    // Update lesson (Admin)
    async updateLesson(id, lessonData) {
      try {
        const response = await api.put(`/content/lessons/${id}`, lessonData)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update lesson')
      }
    },

    // Delete lesson (Admin)
    async deleteLesson(id) {
      try {
        const response = await api.delete(`/content/lessons/${id}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete lesson')
      }
    },

    // Get learning classes
    async getClasses(params = {}) {
      try {
        const response = await api.get('/content/classes', { params })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch classes')
      }
    },

    // Get class by ID
    async getClass(id) {
      try {
        const response = await api.get(`/content/classes/${id}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch class')
      }
    },

    // Create class (Teacher/Admin)
    async createClass(classData) {
      try {
        const response = await api.post('/content/classes', classData)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create class')
      }
    },

    // Assign lesson to class
    async assignLessonToClass(classId, lessonId, options = {}) {
      try {
        const response = await api.post(`/content/classes/${classId}/lessons/${lessonId}`, options)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to assign lesson to class')
      }
    },

    // Get lessons for class
    async getClassLessons(classId) {
      try {
        const response = await api.get(`/content/classes/${classId}/lessons`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch class lessons')
      }
    },

    // Get lesson statistics
    async getLessonStats(id) {
      try {
        const response = await api.get(`/content/lessons/${id}/stats`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch lesson statistics')
      }
    }
  },

  // Learning Activities API
  learning: {
    // Get available lessons for learner
    async getLessons(params = {}) {
      try {
        const response = await api.get('/learning/lessons', { params })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch lessons')
      }
    },

    // Get lesson content
    async getLesson(id) {
      try {
        const response = await api.get(`/learning/lessons/${id}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch lesson')
      }
    },

    // Record lesson progress
    async recordProgress(lessonId, progressData) {
      try {
        const response = await api.post(`/learning/lessons/${lessonId}/progress`, progressData)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to record progress')
      }
    },

    // Get user progress summary
    async getProgress() {
      try {
        const response = await api.get('/learning/progress')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch progress')
      }
    },

    // Get user badges
    async getBadges() {
      try {
        const response = await api.get('/learning/badges')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch badges')
      }
    },

    // Get available badges
    async getAvailableBadges() {
      try {
        const response = await api.get('/learning/badges/available')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch available badges')
      }
    },

    // Get gamified activities
    async getActivities(type = 'all') {
      try {
        const response = await api.get('/learning/activities', { params: { type } })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch activities')
      }
    },

    // Get user classes
    async getClasses() {
      try {
        const response = await api.get('/learning/classes')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch classes')
      }
    },

    // Join class
    async joinClass(classId) {
      try {
        const response = await api.post(`/learning/classes/${classId}/join`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to join class')
      }
    },

    // Get child progress (Parent)
    async getChildProgress(childId) {
      try {
        const response = await api.get(`/learning/children/${childId}/progress`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch child progress')
      }
    }
  },

  // Analytics API
  analytics: {
    // Get user analytics
    async getUserAnalytics() {
      try {
        const response = await api.get('/analytics/user')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch user analytics')
      }
    },

    // Get class analytics
    async getClassAnalytics(classId) {
      try {
        const response = await api.get(`/analytics/class/${classId}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch class analytics')
      }
    },

    // Get platform analytics (Admin)
    async getPlatformAnalytics() {
      try {
        const response = await api.get('/analytics/platform')
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to fetch platform analytics')
      }
    },

    // Export data
    async exportData(format = 'json') {
      try {
        const response = await api.get(`/analytics/export?format=${format}`, {
          responseType: 'blob'
        })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to export data')
      }
    }
  }
}
