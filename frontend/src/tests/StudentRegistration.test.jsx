import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentRegistration from '../pages/teacher/StudentRegistration';
import { LanguageProvider } from '../contexts/LanguageContext';

// Mock the teacher API service
jest.mock('../services/teacherApiService', () => ({
  makeRequest: jest.fn()
}));

const MockWrapper = ({ children }) => (
  <BrowserRouter>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </BrowserRouter>
);

describe('StudentRegistration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders student registration form', () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    expect(screen.getByText(/Student Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Register New Student/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Student Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Grade/i)).toBeInTheDocument();
  });

  test('shows form inputs correctly', () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const ageInput = screen.getByPlaceholderText(/Age/i);

    expect(nameInput).toBeInTheDocument();
    expect(gradeSelect).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const ageInput = screen.getByPlaceholderText(/Age/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.change(ageInput, { target: { value: '9' } });

    expect(nameInput.value).toBe('Test Student');
    expect(gradeSelect.value).toBe('3');
    expect(ageInput.value).toBe('9');
  });

  test('shows grade options correctly', () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const gradeSelect = screen.getByDisplayValue('Select Grade');
    
    expect(screen.getByText('Grade 1')).toBeInTheDocument();
    expect(screen.getByText('Grade 2')).toBeInTheDocument();
    expect(screen.getByText('Grade 3')).toBeInTheDocument();
    expect(screen.getByText('Grade 4')).toBeInTheDocument();
    expect(screen.getByText('Grade 5')).toBeInTheDocument();
    expect(screen.getByText('Grade 6')).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockResolvedValueOnce({ data: [] }) // Initial students fetch
      .mockResolvedValueOnce({ // Registration response
        success: true,
        message: 'Student registered successfully! Registration code: ABC123',
        data: {
          id: 1,
          fullName: 'Test Student',
          grade: '3',
          age: 9,
          registrationCode: 'ABC123'
        }
      })
      .mockResolvedValueOnce({ data: [] }); // Refresh students list

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const ageInput = screen.getByPlaceholderText(/Age/i);
    const submitButton = screen.getByText(/Register Student/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.change(ageInput, { target: { value: '9' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(teacherApiService.makeRequest).toHaveBeenCalledWith('/teacher/register-student', {
        method: 'POST',
        body: JSON.stringify({
          fullName: 'Test Student',
          grade: '3',
          age: 9
        })
      });
    });
  });

  test('shows success message after registration', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        success: true,
        message: 'Student registered successfully! Registration code: ABC123',
        data: {
          id: 1,
          fullName: 'Test Student',
          grade: '3',
          registrationCode: 'ABC123'
        }
      })
      .mockResolvedValueOnce({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const submitButton = screen.getByText(/Register Student/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Student Registered Successfully!/i)).toBeInTheDocument();
      expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
      expect(screen.getByText(/Share this code with the student/i)).toBeInTheDocument();
    });
  });

  test('clears form after successful registration', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        success: true,
        message: 'Student registered successfully! Registration code: ABC123',
        data: {
          id: 1,
          fullName: 'Test Student',
          grade: '3',
          registrationCode: 'ABC123'
        }
      })
      .mockResolvedValueOnce({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const submitButton = screen.getByText(/Register Student/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(gradeSelect.value).toBe('');
    });
  });

  test('shows error message on registration failure', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        success: false,
        error: 'Registration failed'
      });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const submitButton = screen.getByText(/Register Student/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during registration', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockResolvedValueOnce({ data: [] })
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter student's full name/i);
    const gradeSelect = screen.getByDisplayValue('Select Grade');
    const submitButton = screen.getByText(/Register Student/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.change(gradeSelect, { target: { value: '3' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Registering.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('displays registered students list', async () => {
    const mockStudents = [
      {
        id: 1,
        fullName: 'Student One',
        grade: '3',
        age: 9,
        totalPoints: 150,
        registrationCode: 'ABC123',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        fullName: 'Student Two',
        grade: '4',
        age: 10,
        totalPoints: 200,
        registrationCode: 'XYZ789',
        createdAt: '2024-01-02T00:00:00Z'
      }
    ];

    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: mockStudents });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Registered Students \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText('Student One')).toBeInTheDocument();
      expect(screen.getByText('Student Two')).toBeInTheDocument();
      expect(screen.getByText('ABC123')).toBeInTheDocument();
      expect(screen.getByText('XYZ789')).toBeInTheDocument();
    });
  });

  test('shows no students message when list is empty', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/No students registered yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Register your first student/i)).toBeInTheDocument();
    });
  });

  test('handles copy to clipboard functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue()
      }
    });

    const mockStudents = [
      {
        id: 1,
        fullName: 'Student One',
        grade: '3',
        registrationCode: 'ABC123',
        totalPoints: 150,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest.mockResolvedValue({ data: mockStudents });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    await waitFor(() => {
      const copyButton = screen.getAllByText('📋')[0];
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC123');
  });

  test('handles network errors gracefully', async () => {
    const { teacherApiService } = require('../services/teacherApiService');
    teacherApiService.makeRequest
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ data: [] });

    render(
      <MockWrapper>
        <StudentRegistration />
      </MockWrapper>
    );

    // Should still render the form even if students fetch fails
    expect(screen.getByText(/Register New Student/i)).toBeInTheDocument();
  });
});
