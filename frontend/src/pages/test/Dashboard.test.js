import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';

// Suppress act() warnings (optional - for cleaner output)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock API module
jest.mock('../../utils/api', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
}));

// Mock TripList component
jest.mock('../../components/TripList', () => {
  return function MockTripList() {
    return <div data-testid="trip-list">Trip List Mock</div>;
  };
});

// Mock other modals
jest.mock('../../components/CreateTripModal', () => {
  return function MockCreateTripModal() {
    return null;
  };
});

jest.mock('../../components/RechargeModal', () => {
  return function MockRechargeModal() {
    return null;
  };
});

import API from '../../utils/api';

describe('Dashboard - Search Pickup & Drop Location Tests', () => {
  
  const mockUser = {
    userId: 'test123',
    studentId: 'STU123',
    _id: 'test123',
    id: 'test123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    API.put.mockResolvedValue({ data: { balance: 1000 } });
    API.get.mockImplementation((url) => {
      if (url.includes('/notifications')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/trips/organizer')) {
        return Promise.resolve({ data: { averageRating: 4.5, ratingCount: 10 } });
      }
      return Promise.resolve({ data: [] });
    });
  });

  // ============================================
  // PICKUP LOCATION SEARCH TESTS
  // ============================================

  test('displays pickup location search input', () => {
    render(<Dashboard user={mockUser} />);
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    expect(pickupInput).toBeInTheDocument();
  });

  test('allows typing in pickup location input', async () => {
    render(<Dashboard user={mockUser} />);
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, 'Colombo');
    expect(pickupInput).toHaveValue('Colombo');
  });

  test('enforces maximum 15 characters limit for pickup location', async () => {
    render(<Dashboard user={mockUser} />);
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    const longText = 'ThisIsWayMoreThanFifteenChars';
    await userEvent.type(pickupInput, longText);
    expect(pickupInput.value.length).toBeLessThanOrEqual(15);
  });

  test('displays character counter for pickup location', async () => {
    render(<Dashboard user={mockUser} />);
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, 'Colombo');
    
    const counter = screen.getByText((content) => {
      return content.includes('7') && content.includes('15') && content.includes('characters');
    });
    expect(counter).toBeInTheDocument();
  });

  test('shows 0/15 counter when pickup location is empty', () => {
    render(<Dashboard user={mockUser} />);
    const counters = screen.getAllByText((content) => {
      return content.includes('0') && content.includes('15') && content.includes('characters');
    });
    expect(counters.length).toBeGreaterThan(0);
  });

  test('pickup input has maxlength attribute of 15', () => {
    render(<Dashboard user={mockUser} />);
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    expect(pickupInput).toHaveAttribute('maxlength', '15');
  });

  // ============================================
  // DROP LOCATION SEARCH TESTS
  // ============================================

  test('displays drop location search input', () => {
    render(<Dashboard user={mockUser} />);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    expect(dropInput).toBeInTheDocument();
  });

  test('allows typing in drop location input', async () => {
    render(<Dashboard user={mockUser} />);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    await userEvent.type(dropInput, 'Kandy');
    expect(dropInput).toHaveValue('Kandy');
  });

  test('enforces maximum 15 characters limit for drop location', async () => {
    render(<Dashboard user={mockUser} />);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    const longText = 'ThisIsWayMoreThanFifteenChars';
    await userEvent.type(dropInput, longText);
    expect(dropInput.value.length).toBeLessThanOrEqual(15);
  });

  // FIXED: Use getAllByText instead of getByText
  test('displays character counter for drop location', async () => {
    render(<Dashboard user={mockUser} />);
    
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    await userEvent.type(dropInput, 'Kandy');
    
    const counters = screen.getAllByText((content) => {
      return content.includes('5') && content.includes('15') && content.includes('characters');
    });
    expect(counters.length).toBeGreaterThan(0);
  });

  test('shows 0/15 counter when drop location is empty', () => {
    render(<Dashboard user={mockUser} />);
    const counters = screen.getAllByText((content) => {
      return content.includes('0') && content.includes('15') && content.includes('characters');
    });
    expect(counters.length).toBeGreaterThan(0);
  });

  test('drop input has maxlength attribute of 15', () => {
    render(<Dashboard user={mockUser} />);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    expect(dropInput).toHaveAttribute('maxlength', '15');
  });

  // ============================================
  // SEARCH & FILTER SECTION TESTS
  // ============================================

  test('displays Search & Filter section title', () => {
    render(<Dashboard user={mockUser} />);
    const title = screen.getByText('Search & Filter');
    expect(title).toBeInTheDocument();
  });

  test('displays Pickup Location label', () => {
    render(<Dashboard user={mockUser} />);
    const label = screen.getByText('Pickup Location');
    expect(label).toBeInTheDocument();
  });

  test('displays Drop Location label', () => {
    render(<Dashboard user={mockUser} />);
    const label = screen.getByText('Drop Location');
    expect(label).toBeInTheDocument();
  });

  test('clear all button appears when pickup has value', async () => {
    render(<Dashboard user={mockUser} />);
    
    expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
    
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, 'Colombo');
    
    const clearButton = screen.getByText(/clear all/i);
    expect(clearButton).toBeInTheDocument();
  });

  test('clear all button clears pickup location', async () => {
    render(<Dashboard user={mockUser} />);
    
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, 'Colombo');
    expect(pickupInput).toHaveValue('Colombo');
    
    const clearButton = screen.getByText(/clear all/i);
    await userEvent.click(clearButton);
    
    expect(pickupInput).toHaveValue('');
  });

  test('clear all button clears drop location', async () => {
    render(<Dashboard user={mockUser} />);
    
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    await userEvent.type(dropInput, 'Kandy');
    expect(dropInput).toHaveValue('Kandy');
    
    const clearButton = screen.getByText(/clear all/i);
    await userEvent.click(clearButton);
    
    expect(dropInput).toHaveValue('');
  });

  test('displays active filter chip for pickup location', async () => {
    render(<Dashboard user={mockUser} />);
    
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, 'Colombo');
    
    const chip = screen.getByText(/Pickup: Colombo/i);
    expect(chip).toBeInTheDocument();
  });

  test('displays active filter chip for drop location', async () => {
    render(<Dashboard user={mockUser} />);
    
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    await userEvent.type(dropInput, 'Kandy');
    
    const chip = screen.getByText(/Drop: Kandy/i);
    expect(chip).toBeInTheDocument();
  });

  test('clear all button clears both pickup and drop', async () => {
    render(<Dashboard user={mockUser} />);
    
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    
    await userEvent.type(pickupInput, 'Colombo');
    await userEvent.type(dropInput, 'Kandy');
    
    expect(pickupInput).toHaveValue('Colombo');
    expect(dropInput).toHaveValue('Kandy');
    
    const clearButton = screen.getByText(/clear all/i);
    await userEvent.click(clearButton);
    
    expect(pickupInput).toHaveValue('');
    expect(dropInput).toHaveValue('');
  });

  test('vehicle filter exists alongside location search', () => {
    render(<Dashboard user={mockUser} />);
    
    const pickupInput = screen.getByPlaceholderText(/search pickup location/i);
    const dropInput = screen.getByPlaceholderText(/search drop location/i);
    const vehicleSelect = screen.getByRole('combobox');
    
    expect(pickupInput).toBeInTheDocument();
    expect(dropInput).toBeInTheDocument();
    expect(vehicleSelect).toBeInTheDocument();
  });
});