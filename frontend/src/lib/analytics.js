// Analytics and Research Data Collection for DigLearners
import { openDB } from 'idb'

const DB_NAME = 'diglearners-db'
const DB_VERSION = 3

class AnalyticsManager {
  constructor() {
    this.db = null
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.initDB()
  }

  async initDB() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('analytics')) {
          const store = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('eventType', 'eventType')
          store.createIndex('userId', 'userId')
          store.createIndex('sessionId', 'sessionId')
        }
        if (!db.objectStoreNames.contains('researchData')) {
          const store = db.createObjectStore('researchData', { keyPath: 'id', autoIncrement: true })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('dataType', 'dataType')
          store.createIndex('userId', 'userId')
        }
      }
    })
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Track user events for analytics
  async trackEvent(eventType, data = {}) {
    try {
      const event = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: data.userId || 'anonymous',
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      const tx = this.db.transaction('analytics', 'readwrite')
      await tx.objectStore('analytics').add(event)
      await tx.done

      console.log('Event tracked:', eventType, data)
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  // Track research-specific data
  async trackResearchData(dataType, data = {}) {
    try {
      const researchEvent = {
        dataType,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: data.userId || 'anonymous',
        sessionDuration: Date.now() - this.startTime,
        pageViews: await this.getPageViewCount(),
        totalEvents: await this.getTotalEventCount()
      }

      const tx = this.db.transaction('researchData', 'readwrite')
      await tx.objectStore('researchData').add(researchEvent)
      await tx.done

      console.log('Research data tracked:', dataType, data)
    } catch (error) {
      console.error('Error tracking research data:', error)
    }
  }

  // Track lesson interactions
  async trackLessonInteraction(lessonId, interactionType, data = {}) {
    await this.trackEvent('lesson_interaction', {
      lessonId,
      interactionType,
      ...data
    })

    // Also track as research data
    await this.trackResearchData('lesson_interaction', {
      lessonId,
      interactionType,
      ...data
    })
  }

  // Track gamification events
  async trackGamificationEvent(eventType, data = {}) {
    await this.trackEvent('gamification', {
      eventType,
      ...data
    })

    await this.trackResearchData('gamification', {
      eventType,
      ...data
    })
  }

  // Track learning progress
  async trackLearningProgress(lessonId, progressData) {
    await this.trackEvent('learning_progress', {
      lessonId,
      ...progressData
    })

    await this.trackResearchData('learning_progress', {
      lessonId,
      ...progressData
    })
  }

  // Track user engagement
  async trackEngagement(engagementType, data = {}) {
    await this.trackEvent('engagement', {
      engagementType,
      ...data
    })

    await this.trackResearchData('engagement', {
      engagementType,
      ...data
    })
  }

  // Track accessibility usage
  async trackAccessibility(feature, action, data = {}) {
    await this.trackEvent('accessibility', {
      feature,
      action,
      ...data
    })

    await this.trackResearchData('accessibility', {
      feature,
      action,
      ...data
    })
  }

  // Track offline/online usage
  async trackConnectivityStatus(isOnline, data = {}) {
    await this.trackEvent('connectivity', {
      isOnline,
      ...data
    })

    await this.trackResearchData('connectivity', {
      isOnline,
      ...data
    })
  }

  // Track language usage
  async trackLanguageUsage(language, context, data = {}) {
    await this.trackEvent('language_usage', {
      language,
      context,
      ...data
    })

    await this.trackResearchData('language_usage', {
      language,
      context,
      ...data
    })
  }

  // Get analytics data
  async getAnalyticsData(filters = {}) {
    try {
      const tx = this.db.transaction('analytics', 'readonly')
      const store = tx.objectStore('analytics')
      let index = store.index('timestamp')
      
      let range = IDBKeyRange.bound(
        filters.startDate || '1970-01-01',
        filters.endDate || '2099-12-31'
      )
      
      let data = await index.getAll(range)
      
      if (filters.eventType) {
        data = data.filter(event => event.eventType === filters.eventType)
      }
      
      if (filters.userId) {
        data = data.filter(event => event.userId === filters.userId)
      }
      
      return data
    } catch (error) {
      console.error('Error getting analytics data:', error)
      return []
    }
  }

  // Get research data
  async getResearchData(filters = {}) {
    try {
      const tx = this.db.transaction('researchData', 'readonly')
      const store = tx.objectStore('researchData')
      let index = store.index('timestamp')
      
      let range = IDBKeyRange.bound(
        filters.startDate || '1970-01-01',
        filters.endDate || '2099-12-31'
      )
      
      let data = await index.getAll(range)
      
      if (filters.dataType) {
        data = data.filter(item => item.dataType === filters.dataType)
      }
      
      if (filters.userId) {
        data = data.filter(item => item.userId === filters.userId)
      }
      
      return data
    } catch (error) {
      console.error('Error getting research data:', error)
      return []
    }
  }

  // Generate research reports
  async generateResearchReport(startDate, endDate) {
    try {
      const analyticsData = await this.getAnalyticsData({ startDate, endDate })
      const researchData = await this.getResearchData({ startDate, endDate })
      
      const report = {
        period: { startDate, endDate },
        generatedAt: new Date().toISOString(),
        summary: await this.generateSummary(analyticsData, researchData),
        engagement: await this.analyzeEngagement(analyticsData),
        learning: await this.analyzeLearning(researchData),
        accessibility: await this.analyzeAccessibility(analyticsData),
        language: await this.analyzeLanguageUsage(analyticsData),
        connectivity: await this.analyzeConnectivity(analyticsData),
        recommendations: await this.generateRecommendations(analyticsData, researchData)
      }
      
      return report
    } catch (error) {
      console.error('Error generating research report:', error)
      return null
    }
  }

  // Helper methods for analysis
  async generateSummary(analyticsData, researchData) {
    const totalSessions = new Set(analyticsData.map(d => d.sessionId)).size
    const totalUsers = new Set(analyticsData.map(d => d.userId)).size
    const totalEvents = analyticsData.length
    const totalResearchEvents = researchData.length
    
    return {
      totalSessions,
      totalUsers,
      totalEvents,
      totalResearchEvents,
      averageEventsPerSession: totalEvents / totalSessions,
      averageSessionDuration: this.calculateAverageSessionDuration(analyticsData)
    }
  }

  async analyzeEngagement(analyticsData) {
    const engagementEvents = analyticsData.filter(d => d.eventType === 'engagement')
    const lessonEvents = analyticsData.filter(d => d.eventType === 'lesson_interaction')
    const gamificationEvents = analyticsData.filter(d => d.eventType === 'gamification')
    
    return {
      totalEngagementEvents: engagementEvents.length,
      totalLessonInteractions: lessonEvents.length,
      totalGamificationEvents: gamificationEvents.length,
      mostEngagedFeatures: this.getMostFrequentValues(engagementEvents, 'data.engagementType'),
      averageLessonCompletionRate: this.calculateLessonCompletionRate(lessonEvents)
    }
  }

  async analyzeLearning(researchData) {
    const learningData = researchData.filter(d => d.dataType === 'learning_progress')
    const lessonData = researchData.filter(d => d.dataType === 'lesson_interaction')
    
    return {
      totalLearningEvents: learningData.length,
      totalLessonEvents: lessonData.length,
      averageProgressPerLesson: this.calculateAverageProgress(learningData),
      mostPopularLessons: this.getMostFrequentValues(lessonData, 'data.lessonId'),
      learningPatterns: this.analyzeLearningPatterns(learningData)
    }
  }

  async analyzeAccessibility(analyticsData) {
    const accessibilityEvents = analyticsData.filter(d => d.eventType === 'accessibility')
    
    return {
      totalAccessibilityEvents: accessibilityEvents.length,
      mostUsedFeatures: this.getMostFrequentValues(accessibilityEvents, 'data.feature'),
      accessibilityUsageRate: this.calculateUsageRate(accessibilityEvents, analyticsData)
    }
  }

  async analyzeLanguageUsage(analyticsData) {
    const languageEvents = analyticsData.filter(d => d.eventType === 'language_usage')
    
    return {
      totalLanguageEvents: languageEvents.length,
      languageDistribution: this.getLanguageDistribution(languageEvents),
      contextUsage: this.getMostFrequentValues(languageEvents, 'data.context')
    }
  }

  async analyzeConnectivity(analyticsData) {
    const connectivityEvents = analyticsData.filter(d => d.eventType === 'connectivity')
    const onlineEvents = connectivityEvents.filter(d => d.data.isOnline)
    const offlineEvents = connectivityEvents.filter(d => !d.data.isOnline)
    
    return {
      totalConnectivityEvents: connectivityEvents.length,
      onlineEvents: onlineEvents.length,
      offlineEvents: offlineEvents.length,
      offlineUsageRate: offlineEvents.length / connectivityEvents.length
    }
  }

  async generateRecommendations(analyticsData, researchData) {
    const recommendations = []
    
    // Analyze engagement patterns
    const engagement = await this.analyzeEngagement(analyticsData)
    if (engagement.averageLessonCompletionRate < 0.7) {
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        message: 'Low lesson completion rate detected. Consider improving lesson design or adding more interactive elements.'
      })
    }
    
    // Analyze accessibility usage
    const accessibility = await this.analyzeAccessibility(analyticsData)
    if (accessibility.accessibilityUsageRate < 0.1) {
      recommendations.push({
        type: 'accessibility',
        priority: 'medium',
        message: 'Low accessibility feature usage. Consider promoting accessibility features or improving their discoverability.'
      })
    }
    
    // Analyze offline usage
    const connectivity = await this.analyzeConnectivity(analyticsData)
    if (connectivity.offlineUsageRate > 0.3) {
      recommendations.push({
        type: 'connectivity',
        priority: 'high',
        message: 'High offline usage detected. Ensure offline functionality is robust and consider optimizing for low-bandwidth scenarios.'
      })
    }
    
    return recommendations
  }

  // Utility methods
  calculateAverageSessionDuration(analyticsData) {
    const sessions = {}
    analyticsData.forEach(event => {
      if (!sessions[event.sessionId]) {
        sessions[event.sessionId] = { start: event.timestamp, end: event.timestamp }
      } else {
        sessions[event.sessionId].end = event.timestamp
      }
    })
    
    const durations = Object.values(sessions).map(session => 
      new Date(session.end) - new Date(session.start)
    )
    
    return durations.reduce((a, b) => a + b, 0) / durations.length / 1000 / 60 // minutes
  }

  getMostFrequentValues(events, path) {
    const values = {}
    events.forEach(event => {
      const value = this.getNestedValue(event, path)
      if (value) {
        values[value] = (values[value] || 0) + 1
      }
    })
    
    return Object.entries(values)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([value, count]) => ({ value, count }))
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }

  calculateLessonCompletionRate(lessonEvents) {
    const completedLessons = lessonEvents.filter(e => e.data.interactionType === 'completed')
    return completedLessons.length / lessonEvents.length || 0
  }

  calculateAverageProgress(learningData) {
    const progressValues = learningData.map(d => d.data.progress || 0)
    return progressValues.reduce((a, b) => a + b, 0) / progressValues.length || 0
  }

  calculateUsageRate(featureEvents, allEvents) {
    return featureEvents.length / allEvents.length || 0
  }

  getLanguageDistribution(languageEvents) {
    const distribution = {}
    languageEvents.forEach(event => {
      const lang = event.data.language
      distribution[lang] = (distribution[lang] || 0) + 1
    })
    return distribution
  }

  analyzeLearningPatterns(learningData) {
    // Group by lesson and analyze patterns
    const lessonGroups = {}
    learningData.forEach(data => {
      const lessonId = data.data.lessonId
      if (!lessonGroups[lessonId]) {
        lessonGroups[lessonId] = []
      }
      lessonGroups[lessonId].push(data)
    })
    
    return Object.entries(lessonGroups).map(([lessonId, events]) => ({
      lessonId,
      totalEvents: events.length,
      averageProgress: this.calculateAverageProgress(events),
      timeSpent: this.calculateTimeSpent(events)
    }))
  }

  calculateTimeSpent(events) {
    if (events.length < 2) return 0
    
    const sortedEvents = events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    const firstEvent = new Date(sortedEvents[0].timestamp)
    const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].timestamp)
    
    return (lastEvent - firstEvent) / 1000 / 60 // minutes
  }

  async getPageViewCount() {
    const pageViewEvents = await this.getAnalyticsData({ eventType: 'page_view' })
    return pageViewEvents.length
  }

  async getTotalEventCount() {
    const allEvents = await this.getAnalyticsData()
    return allEvents.length
  }

  // Export data for research
  async exportResearchData(format = 'json') {
    try {
      const researchData = await this.getResearchData()
      
      if (format === 'json') {
        return JSON.stringify(researchData, null, 2)
      } else if (format === 'csv') {
        return this.convertToCSV(researchData)
      }
      
      return researchData
    } catch (error) {
      console.error('Error exporting research data:', error)
      return null
    }
  }

  convertToCSV(data) {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n')
    
    return csvContent
  }
}

export const analyticsManager = new AnalyticsManager()

// React hook for analytics
export function useAnalytics() {
  const trackEvent = (eventType, data) => analyticsManager.trackEvent(eventType, data)
  const trackResearchData = (dataType, data) => analyticsManager.trackResearchData(dataType, data)
  const trackLessonInteraction = (lessonId, interactionType, data) => 
    analyticsManager.trackLessonInteraction(lessonId, interactionType, data)
  const trackGamificationEvent = (eventType, data) => 
    analyticsManager.trackGamificationEvent(eventType, data)
  const trackLearningProgress = (lessonId, progressData) => 
    analyticsManager.trackLearningProgress(lessonId, progressData)
  const trackEngagement = (engagementType, data) => 
    analyticsManager.trackEngagement(engagementType, data)
  const trackAccessibility = (feature, action, data) => 
    analyticsManager.trackAccessibility(feature, action, data)
  const trackConnectivityStatus = (isOnline, data) => 
    analyticsManager.trackConnectivityStatus(isOnline, data)
  const trackLanguageUsage = (language, context, data) => 
    analyticsManager.trackLanguageUsage(language, context, data)

  return {
    trackEvent,
    trackResearchData,
    trackLessonInteraction,
    trackGamificationEvent,
    trackLearningProgress,
    trackEngagement,
    trackAccessibility,
    trackConnectivityStatus,
    trackLanguageUsage
  }
}
