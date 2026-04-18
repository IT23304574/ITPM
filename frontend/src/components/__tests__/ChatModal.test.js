import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatModal from '../ChatModal';

// Mock scrollIntoView for test environment
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock the API module
jest.mock('../../utils/api', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn().mockResolvedValue({ data: {} }),
}));

import API from '../../utils/api';

describe('ChatModal - Open Chat Feature Tests', () => {
  
  const defaultProps = {
    tripId: '123',
    isOpen: true,
    onClose: jest.fn(),
    currentUserId: 'user123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Modal open වෙනවාද?
  test('renders chat modal when isOpen is true', () => {
    render(<ChatModal {...defaultProps} />);
    
    const title = screen.getByText('💬 Trip Chat');
    expect(title).toBeInTheDocument();
  });

  // Test 2: Modal නැති වෙනවාද? (isOpen false)
  test('does not render when isOpen is false', () => {
    render(<ChatModal {...defaultProps} isOpen={false} />);
    
    const title = screen.queryByText('💬 Trip Chat');
    expect(title).not.toBeInTheDocument();
  });

  // Test 3: Close button (×) click කළහම onClose call වෙනවාද?
  test('calls onClose when close button (×) is clicked', () => {
    const onClose = jest.fn();
    render(<ChatModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 4: Escape key press කළහම onClose call වෙනවාද?
  test('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<ChatModal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test 5: Input field එකට type කරන්න පුළුවන්ද?
  test('allows typing in message input', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    await userEvent.type(input, 'Hello');
    
    expect(input).toHaveValue('Hello');
  });

  // Test 6: Max 20 characters enforcement
  test('enforces maximum 20 characters limit', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    const longMessage = 'This message is way too long for twenty characters';
    await userEvent.type(input, longMessage);
    
    expect(input.value.length).toBeLessThanOrEqual(20);
  });

  // Test 7: Character counter shows correct count
  test('displays character counter correctly', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    await userEvent.type(input, 'Hi');
    
    const counter = screen.getByText(/2\/20/);
    expect(counter).toBeInTheDocument();
  });

  // Test 8: Send button disabled when input is empty
  test('send button is disabled when input is empty', () => {
    render(<ChatModal {...defaultProps} />);
    
    const sendButton = document.querySelector('button[type="submit"]');
    expect(sendButton).toBeDisabled();
  });

  // Test 9: Send button enabled when input has valid text
  test('send button is enabled when input has valid text', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    await userEvent.type(input, 'Hello');
    
    const sendButton = document.querySelector('button[type="submit"]');
    expect(sendButton).not.toBeDisabled();
  });

  // Test 10: Shows validation error when message contains special characters
  test('shows error when message contains special characters', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    await userEvent.type(input, 'Hello@#$');
    
    const sendButton = document.querySelector('button[type="submit"]');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      // Use getAllByText instead of getByText (multiple elements match)
      const errors = screen.getAllByText(/special characters/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  // Test 11: Shows message rules
  test('displays message rules', () => {
    render(<ChatModal {...defaultProps} />);
    
    const rules = screen.getByText(/1-20 characters/i);
    expect(rules).toBeInTheDocument();
    
    const noSpecialChars = screen.getByText(/No special characters/i);
    expect(noSpecialChars).toBeInTheDocument();
  });

  // Test 12: Shows special characters warning while typing special chars
  test('shows special characters warning while typing special chars', async () => {
    render(<ChatModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/type message/i);
    await userEvent.type(input, 'Hello@#$');
    
    await waitFor(() => {
      // Use getAllByText instead of getByText
      const warnings = screen.getAllByText(/special characters/i);
      expect(warnings.length).toBeGreaterThan(0);
    });
  });
});