// Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children, value: initialValue }) => {
  const [user, setUser] = useState(initialValue?.user || null)
  const [loading, setLoading] = useState(true) // Start with loading true for initial check
  const [error, setError] = useState(null)

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // Verify token with backend
          const result = await authService.verifyToken()
          if (result.success) {
            setUser(result.user)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // If verification fails, remove invalid token
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (initialValue?.user) {
      setUser(initialValue.user)
    }
  }, [initialValue?.user])

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const result = await authService.login(credentials)
      setUser(result.user)
      localStorage.setItem('authToken', result.token)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await authService.register(userData)
      // Don't auto-login after registration - user should login manually
      // setUser(result.user)
      // localStorage.setItem('authToken', result.token)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('authToken')
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await authService.updateProfile(profileData)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      await authService.changePassword(passwordData)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
