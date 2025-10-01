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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
