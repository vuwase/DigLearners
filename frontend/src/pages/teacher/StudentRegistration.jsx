import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import teacherApiService from '../../services/teacherApiService';

const StudentRegistration = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    grade: '',
    age: '',
    school: '',
    otherSchool: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await teacherApiService.makeRequest('/teacher/my-students');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await teacherApiService.makeRequest('/teacher/register-student', {
        method: 'POST',
          body: JSON.stringify({
          fullName: formData.fullName.trim(),
          grade: formData.grade,
          age: formData.age ? parseInt(formData.age) : null,
          school: formData.school === 'other' ? (formData.otherSchool || null) : (formData.school || null)
        })
      });

      if (response.success) {
        setSuccess({
          message: response.message,
          student: response.data
        });
        setFormData({ fullName: '', grade: '', age: '', school: '', otherSchool: '' });
        // Refresh the students list
        fetchStudents();
      } else {
        setError(response.error || t('teacher.studentRegFailed') || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(t('teacher.studentRegError') || 'Failed to register student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  return (
    <div className="student-registration-page">
      <div className="page-header">
        <h1>👨‍🎓 {t('teacher.registerStudent') || 'Student Registration'}</h1>
        <p>{t('teacher.registerStudentDesc') || 'Register new students and manage their registration codes'}</p>
      </div>

      <div className="registration-container">
        {/* Registration Form */}
        <div className="registration-form-section">
          <h2>{t('teacher.registerNewStudent') || 'Register New Student'}</h2>
          
          {success && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <div className="success-content">
                <div className="success-title">{t('teacher.studentRegisteredSuccess') || 'Student Registered Successfully!'}</div>
                <div className="success-text">{success.message}</div>
                <div className="registration-code-display">
                  <strong>{t('auth.student.code') || 'Registration Code'}: </strong>
                  <span className="code-highlight">{success.student.registrationCode}</span>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(success.student.registrationCode)}
                    title={t('teacher.copyToClipboard') || 'Copy to clipboard'}
                  >
                    📋
                  </button>
                </div>
                <div className="success-note">
                  {t('teacher.shareCodeWithStudent') || 'Share this code with the student for login.'}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-icon">❌</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="fullName">{t('teacher.studentFullName') || 'Student Full Name'} *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder={t('teacher.enterStudentName') || 'Enter student\'s full name'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="school">{t('teacher.school') || 'School'} *</label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              >
                <option value="">{t('teacher.selectSchool') || 'Select School'}</option>
                <optgroup label={t('teacher.kigaliSchools') || 'Kigali Schools'}>
                  <option value="Kacyiru Primary School">Kacyiru Primary School</option>
                  <option value="Groupe Scolaire Camp Kigali">Groupe Scolaire Camp Kigali</option>
                  <option value="Groupe Scolaire Kimironko II">Groupe Scolaire Kimironko II</option>
                  <option value="Groupe Scolaire Gikondo">Groupe Scolaire Gikondo</option>
                  <option value="Groupe Scolaire Saint Famille">Groupe Scolaire Saint Famille</option>
                  <option value="Remera Catholic Primary School">Remera Catholic Primary School</option>
                  <option value="Groupe Scolaire Kicukiro">Groupe Scolaire Kicukiro</option>
                  <option value="Kigali Parents School">Kigali Parents School</option>
                </optgroup>
                <optgroup label={t('teacher.northernSchools') || 'Northern Province Schools'}>
                  <option value="Groupe Scolaire Ruhengeri">Groupe Scolaire Ruhengeri</option>
                  <option value="Groupe Scolaire Muhoza">Groupe Scolaire Muhoza</option>
                  <option value="Groupe Scolaire Kinigi">Groupe Scolaire Kinigi</option>
                  <option value="Groupe Scolaire Busogo">Groupe Scolaire Busogo</option>
                </optgroup>
                <optgroup label={t('teacher.southernSchools') || 'Southern Province Schools'}>
                  <option value="Groupe Scolaire Butare Catholique">Groupe Scolaire Butare Catholique</option>
                  <option value="Groupe Scolaire Save">Groupe Scolaire Save</option>
                  <option value="Groupe Scolaire Nyanza">Groupe Scolaire Nyanza</option>
                  <option value="Groupe Scolaire Gikonko">Groupe Scolaire Gikonko</option>
                </optgroup>
                <optgroup label={t('teacher.easternSchools') || 'Eastern Province Schools'}>
                  <option value="Groupe Scolaire Rwamagana Catholique">Groupe Scolaire Rwamagana Catholique</option>
                  <option value="Groupe Scolaire Kayonza Modern">Groupe Scolaire Kayonza Modern</option>
                  <option value="Groupe Scolaire Ngoma">Groupe Scolaire Ngoma</option>
                  <option value="Groupe Scolaire Nyagatare">Groupe Scolaire Nyagatare</option>
                </optgroup>
                <optgroup label={t('teacher.westernSchools') || 'Western Province Schools'}>
                  <option value="Groupe Scolaire Gisenyi">Groupe Scolaire Gisenyi</option>
                  <option value="Groupe Scolaire Karongi A">Groupe Scolaire Karongi A</option>
                  <option value="Groupe Scolaire Bugarama">Groupe Scolaire Bugarama</option>
                  <option value="Groupe Scolaire Nyundo">Groupe Scolaire Nyundo</option>
                </optgroup>
                <option value="other">{t('teacher.otherSchool') || 'Other (Please specify)'}</option>
              </select>
            </div>

            {formData.school === 'other' && (
              <div className="form-group">
                <label htmlFor="otherSchool">{t('teacher.schoolName') || 'School Name'} *</label>
                <input
                  type="text"
                  id="otherSchool"
                  name="otherSchool"
                  value={formData.otherSchool || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      otherSchool: e.target.value,
                      school: e.target.value // Update school field when typing
                    })
                  }}
                  placeholder={t('teacher.enterSchoolName') || 'Enter school name'}
                  required={formData.school === 'other'}
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="grade">{t('auth.student.grade') || 'Grade'} *</label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('common.select') || 'Select Grade'}</option>
                  <option value="1">{t('grades.grade1') || 'Grade 1'}</option>
                  <option value="2">{t('grades.grade2') || 'Grade 2'}</option>
                  <option value="3">{t('grades.grade3') || 'Grade 3'}</option>
                  <option value="4">{t('grades.grade4') || 'Grade 4'}</option>
                  <option value="5">{t('grades.grade5') || 'Grade 5'}</option>
                  <option value="6">{t('grades.grade6') || 'Grade 6'}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">{t('teacher.ageOptional') || 'Age (optional)'}</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="5"
                  max="18"
                  placeholder={t('teacher.age') || 'Age'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? (t('teacher.registering') || 'Registering...') : (t('teacher.registerStudent') || 'Register Student')}
            </button>
          </form>
        </div>

        {/* Students List */}
        <div className="students-list-section">
          <h2>{t('teacher.registeredStudents') || 'Registered Students'} ({students.length})</h2>
          
          {loadingStudents ? (
            <div className="loading">{t('common.loading') || 'Loading students...'}</div>
          ) : students.length === 0 ? (
            <div className="no-students">
              <div className="no-students-icon">👥</div>
              <p>{t('teacher.noStudentsYet') || 'No students registered yet.'}</p>
              <p>{t('teacher.registerFirstStudent') || 'Register your first student using the form above.'}</p>
            </div>
          ) : (
            <div className="students-grid">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-header">
                    <h3>{student.fullName}</h3>
                    <div className="student-grade">{t(`grades.grade${student.grade}`) || `Grade ${student.grade}`}</div>
                  </div>
                  <div className="student-details">
                    {student.school && <p><strong>{t('teacher.school') || 'School'}:</strong> {student.school}</p>}
                    {student.age && <p><strong>{t('teacher.age') || 'Age'}:</strong> {student.age}</p>}
                    <p><strong>{t('student.points') || 'Points'}:</strong> {student.totalPoints || 0}</p>
                    <p><strong>{t('teacher.registered') || 'Registered'}:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="registration-code-section">
                    <div className="code-label">{t('auth.student.code') || 'Registration Code'}:</div>
                    <div className="code-display">
                      <span className="code">{student.registrationCode}</span>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(student.registrationCode)}
                        title={t('teacher.copyToClipboard') || 'Copy to clipboard'}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .student-registration-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          color: var(--primary-color, #FF677D);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: var(--text-dark, #2d3748);
          font-size: 1.1rem;
        }

        .registration-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .registration-form-section,
        .students-list-section {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .registration-form-section h2,
        .students-list-section h2 {
          color: var(--primary-color, #FF677D);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .success-message {
          background: linear-gradient(135deg, #d1fae5, #ecfdf5);
          color: #065f46;
          border: 2px solid #10b981;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .success-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .success-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .registration-code-display {
          background: rgba(16, 185, 129, 0.1);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .code-highlight {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          color: #047857;
          background: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .copy-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .success-note {
          font-size: 0.9rem;
          color: #047857;
          font-style: italic;
        }

        .error-message {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #991b1b;
          border: 2px solid #ef4444;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-dark, #2d3748);
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-color, #FF677D);
        }

        .register-button {
          background: linear-gradient(135deg, var(--primary-color, #FF677D), var(--secondary-color, #F8B400));
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 103, 125, 0.3);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--text-dark, #2d3748);
        }

        .no-students {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-dark, #2d3748);
        }

        .no-students-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .students-grid {
          display: grid;
          gap: 1rem;
        }

        .student-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .student-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .student-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .student-header h3 {
          color: var(--primary-color, #FF677D);
          margin: 0;
          font-size: 1.2rem;
        }

        .student-grade {
          background: var(--third-color, #4ECDC4);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .student-details {
          margin-bottom: 1rem;
        }

        .student-details p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: var(--text-dark, #2d3748);
        }

        .registration-code-section {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .code-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .code-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .code {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: var(--primary-color, #FF677D);
          font-size: 1.1rem;
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .registration-container {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .student-registration-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentRegistration;
