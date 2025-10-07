const express = require('express')
const cors = require('cors')
const path = require('path')

// Import database models and initialization
const { initializeDatabase } = require('./models')

// Import API routes
const authRoutes = require('./api/auth')
const contentRoutes = require('./api/content')
const learningRoutes = require('./api/learning')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DigLearners Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  })
})

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    data: {
      platform: 'DigLearners',
      purpose: 'Digital Literacy for Rwandan Primary Schools',
      features: ['Offline-First', 'Gamification', 'Multilingual', 'Child-Friendly']
    }
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/learning', learningRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedPath: req.originalUrl,
    availableEndpoints: {
      health: 'GET /health',
      apiHealth: 'GET /api/health',
      test: 'GET /api/test',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile'
      },
      content: {
        lessons: 'GET /api/content/lessons',
        classes: 'GET /api/content/classes'
      },
      learning: {
        lessons: 'GET /api/learning/lessons',
        progress: 'POST /api/learning/lessons/:id/progress',
        badges: 'GET /api/learning/badges'
      }
    }
  })
})

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    console.log('Initializing database...')
    await initializeDatabase()
    console.log('Database initialized successfully')

    // Start server
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════════')
      console.log(`DigLearners Backend running on http://localhost:${PORT}`)
      console.log('═══════════════════════════════════════════════════════')
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`Auth API: http://localhost:${PORT}/api/auth`)
      console.log(`Content API: http://localhost:${PORT}/api/content`)
      console.log(`Learning API: http://localhost:${PORT}/api/learning`)
      console.log('═══════════════════════════════════════════════════════')
      console.log('Default credentials:')
      console.log('  Admin: admin@diglearners.rw / admin123')
      console.log('  Teacher: teacher@diglearners.rw / teacher123')
      console.log('═══════════════════════════════════════════════════════')
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()