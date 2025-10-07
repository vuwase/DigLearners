// Role Selector Component
import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import Icon from '../icons/Icon'

const RoleSelector = ({ onRoleSelect }) => {
  const { t } = useLanguage()

  const roles = [
    {
      id: 'learner',
      title: t('role.learner'),
      description: t('role.roleDescription.learner'),
      icon: 'student',
      color: '#0ea5a4'
    },
    {
      id: 'teacher',
      title: t('role.teacher'),
      description: t('role.roleDescription.teacher'),
      icon: 'teacher',
      color: '#059669'
    },
    {
      id: 'parent',
      title: t('role.parent'),
      description: t('role.roleDescription.parent'),
      icon: 'users',
      color: '#7c3aed'
    },
    {
      id: 'admin',
      title: t('role.admin'),
      description: t('role.roleDescription.admin'),
      icon: 'settings',
      color: '#dc2626'
    }
  ]

  return (
    <div className="role-selector-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0ea5a4, #06b6d4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="role-selector-container" style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        padding: '3rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        <div className="role-header" style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            color: '#0ea5a4',
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>DigLearners</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.2rem'
          }}>Choose your role to continue</p>
        </div>
        
        <div className="roles-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {roles.map((role) => (
            <div
              key={role.id}
              className="role-card"
              onClick={() => onRoleSelect(role.id)}
              style={{
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = role.color
                e.target.style.transform = 'translateY(-4px)'
                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="role-icon" style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Icon name={role.icon} size={48} />
              </div>
              <h3 style={{
                color: role.color,
                fontSize: '1.5rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>{role.title}</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>{role.description}</p>
              <div className="role-arrow" style={{
                color: role.color,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}>→</div>
            </div>
          ))}
        </div>
        
        <div className="role-footer" style={{ textAlign: 'center' }}>
          <p style={{
            color: '#6b7280',
            fontStyle: 'italic'
          }}>Select the role that best describes you</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
