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
        console.log('[AuthContext] Initializing auth, token exists:', !!token)
        
        if (token) {
          try {
            // Verify token with backend
            console.log('[AuthContext] Verifying token with backend...')
            const result = await authService.verifyToken()
            console.log('[AuthContext] Token verification result:', { 
              success: result?.success, 
              hasUser: !!result?.user,
              userRole: result?.user?.role 
            })
            
            if (result?.success && result?.user) {
              console.log('[AuthContext] Token verified, setting user:', result.user.email || result.user.fullName)
              setUser(result.user)
            } else {
              // Token is invalid, remove it
              console.log('[AuthContext] Token invalid, removing from storage')
              localStorage.removeItem('authToken')
            }
          } catch (verifyError) {
            console.error('[AuthContext] Token verification failed:', verifyError)
            // If verification fails, try to keep the token if it's a network error
            // Only remove if it's an authentication error
            if (verifyError.response?.status === 401 || verifyError.message?.includes('invalid')) {
              localStorage.removeItem('authToken')
            }
          }
        } else {
          console.log('[AuthContext] No token found, user not authenticated')
        }
      } catch (error) {
        console.error('[AuthContext] Auth initialization error:', error)
        // If verification fails, remove invalid token
        const token = localStorage.getItem('authToken')
        if (token) {
          // Only remove if it's clearly an auth error
          if (error.response?.status === 401 || error.message?.includes('invalid')) {
            localStorage.removeItem('authToken')
          }
        }
      } finally {
        console.log('[AuthContext] Auth initialization complete, setting loading to false')
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

  // Re-check token if it exists but user is not loaded (after login redirect)
  // This helps when user navigates immediately after login
  useEffect(() => {
    if (loading) return // Don't check while initial loading is happening
    if (user) return // User already loaded, no need to check
    
    const checkTokenOnMount = async () => {
      const token = localStorage.getItem('authToken')
      if (token && !user) {
        console.log('[AuthContext] Token exists but user not loaded, re-verifying...')
        setLoading(true) // Set loading to prevent redirect loops
        try {
          const result = await authService.verifyToken()
          if (result?.success && result?.user) {
            console.log('[AuthContext] User loaded from token verification')
            setUser(result.user)
          } else {
            console.log('[AuthContext] Token verification failed, removing token')
            localStorage.removeItem('authToken')
          }
        } catch (error) {
          console.error('[AuthContext] Token re-verification failed:', error)
          // Only remove token if it's clearly invalid
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken')
          }
        } finally {
          setLoading(false)
        }
      }
    }

    // Small delay to ensure other initialization is complete
    const timer = setTimeout(checkTokenOnMount, 300)
    return () => clearTimeout(timer)
  }, [loading, user]) // Run when loading becomes false or user changes

  const login = async (credentials) => {
    console.log('[AuthContext] Login called with:', { 
      email: credentials.email, 
      loginType: credentials.loginType 
    })
    setLoading(true)
    setError(null)
    try {
      console.log('[AuthContext] Calling authService.login...')
      const result = await authService.login(credentials)
      console.log('[AuthContext] Login result:', {
        success: result?.success,
        hasUser: !!result?.user,
        hasToken: !!result?.token,
        userEmail: result?.user?.email,
        userRole: result?.user?.role
      })
      
      if (!result) {
        console.error('[AuthContext] ERROR: No result returned from authService.login!')
        throw new Error('No response received from login service')
      }
      
      if (!result.success) {
        console.error('[AuthContext] Login failed - result.success is false:', result)
        const errorMsg = result.error || 'Login failed'
        setError({ message: errorMsg, type: 'login_failed' })
        throw new Error(errorMsg)
      }
      
      if (!result.user) {
        console.error('[AuthContext] ERROR: Login succeeded but no user object!')
        throw new Error('Login succeeded but user data is missing')
      }
      
      if (!result.token) {
        console.error('[AuthContext] ERROR: Login succeeded but no token!')
        throw new Error('Login succeeded but authentication token is missing')
      }
      
      console.log('[AuthContext] Setting user and token...')
      setUser(result.user)
      localStorage.setItem('authToken', result.token)
      const userIdentifier = result.user.email || result.user.fullName || 'User'
      console.log('[AuthContext] Login successful! User:', userIdentifier, 'Role:', result.user.role)
      
      return result
    } catch (error) {
      console.error('[AuthContext] Login error caught:', error)
      console.error('[AuthContext] Error details:', {
        message: error.message,
        type: error.type,
        status: error.status,
        stack: error.stack
      })
      
      // Enhanced error handling with specific error types
      const errorDetails = {
        message: error.message || 'Login failed',
        type: error.type || 'unknown_error',
        status: error.status
      }
      setError(errorDetails)
      throw error
    } finally {
      console.log('[AuthContext] Login finally block - setting loading to false')
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
