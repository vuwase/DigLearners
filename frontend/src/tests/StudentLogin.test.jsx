import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentLogin from '../pages/auth/StudentLogin';
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

describe('StudentLogin Component', () => {
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders student login form', () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    expect(screen.getByText(/Student Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1\/3/i)).toBeInTheDocument();
  });

  test('shows name input on first step', () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/What is your name/i)).toBeInTheDocument();
  });

  test('progresses to grade selection on valid name', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    const nextButton = screen.getByText(/Next/i);

    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Step 2\/3/i)).toBeInTheDocument();
      expect(screen.getByText(/Which grade are you in/i)).toBeInTheDocument();
    });
  });

  test('shows error for empty name', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
    });
  });

  test('shows grade selection buttons', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress to step 2
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      expect(screen.getByText('Grade 1')).toBeInTheDocument();
      expect(screen.getByText('Grade 2')).toBeInTheDocument();
      expect(screen.getByText('Grade 3')).toBeInTheDocument();
      expect(screen.getByText('Grade 4')).toBeInTheDocument();
      expect(screen.getByText('Grade 5')).toBeInTheDocument();
      expect(screen.getByText('Grade 6')).toBeInTheDocument();
    });
  });

  test('progresses to registration code on grade selection', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress to step 2
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      const grade3Button = screen.getByText('Grade 3');
      fireEvent.click(grade3Button);
    });

    await waitFor(() => {
      expect(screen.getByText(/Step 3\/3/i)).toBeInTheDocument();
      expect(screen.getByText(/registration code/i)).toBeInTheDocument();
    });
  });

  test('shows registration code input with proper formatting', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress to step 3
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText(/ABC123/i);
      expect(codeInput).toBeInTheDocument();
      expect(codeInput).toHaveAttribute('maxLength', '6');
    });
  });

  test('formats registration code input to uppercase', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress to step 3
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText(/ABC123/i);
      fireEvent.change(codeInput, { target: { value: 'abc123' } });
      expect(codeInput.value).toBe('ABC123');
    });
  });

  test('shows answer summary', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress through all steps
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      expect(screen.getByText('Test Student')).toBeInTheDocument();
      expect(screen.getByText('Grade 3')).toBeInTheDocument();
    });
  });

  test('allows going back to previous steps', async () => {
    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Progress to step 2
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      const backButton = screen.getByText(/Back/i);
      fireEvent.click(backButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Step 1\/3/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Student')).toBeInTheDocument();
    });
  });

  test('calls onLogin with correct data on form submission', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: true,
      token: 'mock-token',
      user: { id: 1, fullName: 'Test Student', role: 'learner' }
    });

    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Complete all steps
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText(/ABC123/i);
      fireEvent.change(codeInput, { target: { value: 'TEST01' } });
      fireEvent.click(screen.getByText(/Login/i));
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        loginType: 'student',
        fullName: 'Test Student',
        grade: '3',
        registrationCode: 'TEST01'
      });
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test('shows error message on login failure', async () => {
    const authService = require('../services/authService');
    authService.login.mockResolvedValue({
      success: false,
      error: 'Student not found'
    });

    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Complete all steps
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Wrong Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText(/ABC123/i);
      fireEvent.change(codeInput, { target: { value: 'WRONG1' } });
      fireEvent.click(screen.getByText(/Login/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/Student not found/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    const authService = require('../services/authService');
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MockWrapper>
        <StudentLogin onLogin={mockOnLogin} />
      </MockWrapper>
    );

    // Complete all steps
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Student' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Grade 3'));
    });

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText(/ABC123/i);
      fireEvent.change(codeInput, { target: { value: 'TEST01' } });
      fireEvent.click(screen.getByText(/Login/i));
    });

    expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
  });
});
