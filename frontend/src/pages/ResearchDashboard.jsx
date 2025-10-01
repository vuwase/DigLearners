import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { analyticsManager } from '../lib/analytics'
import MyComponent from '../components/MyComponent'

export default function ResearchDashboard() {
  const { t } = useTranslation()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  })
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    generateReport()
  }, [dateRange])

  const generateReport = async () => {
    setLoading(true)
    try {
      const researchReport = await analyticsManager.generateResearchReport(
        dateRange.startDate,
        dateRange.endDate
      )
      setReport(researchReport)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (format) => {
    try {
      const data = await analyticsManager.exportResearchData(format)
      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `diglearners-research-data-${dateRange.startDate}-${dateRange.endDate}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  if (loading) {
    return (
      <MyComponent title="Research Dashboard" subtitle="Generating report...">
        <div className="loading">Loading research data...</div>
      </MyComponent>
    )
  }

  if (!report) {
    return (
      <MyComponent title="Research Dashboard" subtitle="Error loading data">
        <div className="error">Unable to load research data. Please try again.</div>
      </MyComponent>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'engagement', label: 'Engagement', icon: '🎯' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'language', label: 'Language', icon: '🌐' },
    { id: 'connectivity', label: 'Connectivity', icon: '📡' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' }
  ]

  return (
    <MyComponent title="Research Dashboard" subtitle={`${dateRange.startDate} to ${dateRange.endDate}`}>
      {/* Date Range Selector */}
      <div className="date-range-selector">
        <div className="date-inputs">
          <div className="date-input">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            />
          </div>
          <div className="date-input">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            />
          </div>
        </div>
        <div className="export-buttons">
          <button onClick={() => exportData('json')} className="export-button">
            📄 Export JSON
          </button>
          <button onClick={() => exportData('csv')} className="export-button">
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="research-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`research-tab ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="research-content">
        {selectedTab === 'overview' && (
          <div className="overview-section">
            <h3>📊 Overview</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{report.summary.totalSessions}</div>
                <div className="metric-label">Total Sessions</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{report.summary.totalUsers}</div>
                <div className="metric-label">Unique Users</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{report.summary.totalEvents}</div>
                <div className="metric-label">Total Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.summary.averageEventsPerSession)}</div>
                <div className="metric-label">Avg Events/Session</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.summary.averageSessionDuration)}m</div>
                <div className="metric-label">Avg Session Duration</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'engagement' && (
          <div className="engagement-section">
            <h3>🎯 Engagement Analysis</h3>
            <div className="engagement-metrics">
              <div className="metric-card">
                <div className="metric-value">{report.engagement.totalEngagementEvents}</div>
                <div className="metric-label">Engagement Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{report.engagement.totalLessonInteractions}</div>
                <div className="metric-label">Lesson Interactions</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.engagement.averageLessonCompletionRate * 100)}%</div>
                <div className="metric-label">Lesson Completion Rate</div>
              </div>
            </div>
            
            <div className="feature-usage">
              <h4>Most Engaged Features</h4>
              <div className="usage-list">
                {report.engagement.mostEngagedFeatures.map((feature, index) => (
                  <div key={index} className="usage-item">
                    <span className="usage-feature">{feature.value}</span>
                    <span className="usage-count">{feature.count} uses</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'learning' && (
          <div className="learning-section">
            <h3>📚 Learning Analysis</h3>
            <div className="learning-metrics">
              <div className="metric-card">
                <div className="metric-value">{report.learning.totalLearningEvents}</div>
                <div className="metric-label">Learning Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.learning.averageProgressPerLesson)}%</div>
                <div className="metric-label">Avg Progress/Lesson</div>
              </div>
            </div>
            
            <div className="popular-lessons">
              <h4>Most Popular Lessons</h4>
              <div className="lessons-list">
                {report.learning.mostPopularLessons.map((lesson, index) => (
                  <div key={index} className="lesson-item">
                    <span className="lesson-id">Lesson {lesson.value}</span>
                    <span className="lesson-count">{lesson.count} interactions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'accessibility' && (
          <div className="accessibility-section">
            <h3>♿ Accessibility Analysis</h3>
            <div className="accessibility-metrics">
              <div className="metric-card">
                <div className="metric-value">{report.accessibility.totalAccessibilityEvents}</div>
                <div className="metric-label">Accessibility Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.accessibility.accessibilityUsageRate * 100)}%</div>
                <div className="metric-label">Usage Rate</div>
              </div>
            </div>
            
            <div className="accessibility-features">
              <h4>Most Used Features</h4>
              <div className="features-list">
                {report.accessibility.mostUsedFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-name">{feature.value}</span>
                    <span className="feature-count">{feature.count} uses</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'language' && (
          <div className="language-section">
            <h3>🌐 Language Usage Analysis</h3>
            <div className="language-metrics">
              <div className="metric-card">
                <div className="metric-value">{report.language.totalLanguageEvents}</div>
                <div className="metric-label">Language Events</div>
              </div>
            </div>
            
            <div className="language-distribution">
              <h4>Language Distribution</h4>
              <div className="language-chart">
                {Object.entries(report.language.languageDistribution).map(([lang, count]) => (
                  <div key={lang} className="language-bar">
                    <span className="language-name">{lang}</span>
                    <div className="language-progress">
                      <div 
                        className="language-fill" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(report.language.languageDistribution))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="language-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'connectivity' && (
          <div className="connectivity-section">
            <h3>📡 Connectivity Analysis</h3>
            <div className="connectivity-metrics">
              <div className="metric-card">
                <div className="metric-value">{report.connectivity.totalConnectivityEvents}</div>
                <div className="metric-label">Connectivity Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{report.connectivity.onlineEvents}</div>
                <div className="metric-label">Online Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{report.connectivity.offlineEvents}</div>
                <div className="metric-label">Offline Events</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{Math.round(report.connectivity.offlineUsageRate * 100)}%</div>
                <div className="metric-label">Offline Usage Rate</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'recommendations' && (
          <div className="recommendations-section">
            <h3>💡 Recommendations</h3>
            <div className="recommendations-list">
              {report.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card ${rec.priority}`}>
                  <div className="recommendation-header">
                    <span className="recommendation-type">{rec.type}</span>
                    <span className={`recommendation-priority ${rec.priority}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="recommendation-message">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MyComponent>
  )
}
