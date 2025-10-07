import React from 'react'
import { useTranslation } from '../../lib/language'
import { mockUserProgress, mockClassProgress } from '../../services/mockDataService'
import ProgressTracker from '../../components/ProgressTracker'
import ProgressDashboard from '../../components/ProgressDashboard'
import Icon from '../../components/icons/Icon'
import '../../components/CodePlayStyles.css'
import '../../components/DashboardStyles.css'

export default function Progress() {
  const { t } = useTranslation()

  return (
    <div className="progress-page">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="analytics" size={24} />
            </div>
            <span className="user-name">My Progress</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lesson-content">
        <ProgressDashboard userId="demo-student-1" />
      </div>
    </div>
  )
}
