// Theme Context - Accessibility and UI Customization
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('diglearners-theme')
    return savedTheme || 'light'
  })

  const [accessibility, setAccessibility] = useState(() => {
    const savedAccessibility = localStorage.getItem('diglearners-accessibility')
    return savedAccessibility ? JSON.parse(savedAccessibility) : {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
      motorAssistance: false,
      cognitiveSupport: false
    }
  })

  useEffect(() => {
    localStorage.setItem('diglearners-theme', theme)
    applyTheme()
  }, [theme])

  useEffect(() => {
    localStorage.setItem('diglearners-accessibility', JSON.stringify(accessibility))
    applyAccessibility()
  }, [accessibility])

  const applyTheme = () => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const applyAccessibility = () => {
    const root = document.documentElement
    
    // High contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text
    if (accessibility.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Screen reader support
    if (accessibility.screenReader) {
      root.classList.add('screen-reader')
    } else {
      root.classList.remove('screen-reader')
    }

    // Keyboard navigation
    if (accessibility.keyboardNavigation) {
      root.classList.add('keyboard-navigation')
    } else {
      root.classList.remove('keyboard-navigation')
    }

    // Color blind support
    if (accessibility.colorBlindSupport) {
      root.classList.add('color-blind-support')
    } else {
      root.classList.remove('color-blind-support')
    }

    // Motor assistance
    if (accessibility.motorAssistance) {
      root.classList.add('motor-assistance')
    } else {
      root.classList.remove('motor-assistance')
    }

    // Cognitive support
    if (accessibility.cognitiveSupport) {
      root.classList.add('cognitive-support')
    } else {
      root.classList.remove('cognitive-support')
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const updateAccessibility = (updates) => {
    setAccessibility(prev => ({ ...prev, ...updates }))
  }

  const resetAccessibility = () => {
    setAccessibility({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
      motorAssistance: false,
      cognitiveSupport: false
    })
  }

  const getAccessibilityScore = () => {
    const enabledFeatures = Object.values(accessibility).filter(Boolean).length
    const totalFeatures = Object.keys(accessibility).length
    return Math.round((enabledFeatures / totalFeatures) * 100)
  }

  const value = {
    theme,
    accessibility,
    toggleTheme,
    updateAccessibility,
    resetAccessibility,
    getAccessibilityScore,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
