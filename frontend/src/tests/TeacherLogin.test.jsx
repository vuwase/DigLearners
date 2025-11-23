import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeacherLogin from '../pages/auth/TeacherLogin';
import { LanguageProvider } from '../contexts/LanguageContext';

// Mock the auth service
jest.mock('../services/authService', () => ({
  login: jest.fn()
}));

const MockWrapper = ({ children }) => (
  <BrowserRouter>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </BrowserRouter>
);

describe('TeacherLogin Component', () => {
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders teacher login form', () => {
    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    expect(screen.getByText(/Teacher Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('shows email and password inputs', () => {
    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('updates form data on input change', () => {
    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('teacher@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);

    // HTML5 validation should prevent submission
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toBeRequired();
  });

  test('calls onLogin with correct data on form submission', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: true,
      token: 'mock-token',
      user: { id: 1, fullName: 'Test Teacher', role: 'teacher' }
    });

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        loginType: 'teacher',
        email: 'teacher@test.com',
        password: 'password123'
      });
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test('shows success message on successful login', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: true,
      token: 'mock-token',
      user: { id: 1, fullName: 'Test Teacher', role: 'teacher' }
    });

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Welcome Back, Teacher!/i)).toBeInTheDocument();
      expect(screen.getByText(/Taking you to your teacher dashboard/i)).toBeInTheDocument();
    });
  });

  test('shows error message on login failure', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
      errorType: 'invalid_credentials'
    });

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    const authService = require('../services/authService');
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
  });

  test('disables form during loading', async () => {
    const authService = require('../services/authService');
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
  });

  test('shows appropriate error icons and suggestions', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
      errorType: 'invalid_credentials'
    });

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Login Failed/i)).toBeInTheDocument();
      expect(screen.getByText(/Check your email and password/i)).toBeInTheDocument();
    });
  });

  test('handles network errors gracefully', async () => {
    const authService = require('../services/authService');
    authService.login.mockRejectedValue(new Error('Network error'));

    render(
      <MockWrapper>
        <TeacherLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByText(/Login/i);

    fireEvent.change(emailInput, { target: { value: 'teacher@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
});
