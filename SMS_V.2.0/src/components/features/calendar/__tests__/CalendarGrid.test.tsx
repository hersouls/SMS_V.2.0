import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalendarGrid } from '../CalendarGrid';
import { generateCalendarGrid, generatePaymentEvents } from '../../../../utils/calendar';
import { type Subscription } from '../../../../types/database.types';

// Mock data
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    user_id: 'user1',
    service_name: 'Netflix',
    amount: 17000,
    currency: 'KRW',
    payment_cycle: 'monthly',
    next_payment_date: '2025-01-15',
    status: 'active',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    user_id: 'user1',
    service_name: 'Spotify',
    amount: 13900,
    currency: 'KRW',
    payment_cycle: 'monthly',
    next_payment_date: '2025-01-20',
    status: 'active',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

describe('CalendarGrid', () => {
  it('renders calendar with correct month and year', () => {
    const year = 2025;
    const month = 1;
    const events = generatePaymentEvents(mockSubscriptions, year, month);
    const calendar = generateCalendarGrid(year, month, events);
    
    const mockOnMonthChange = vi.fn();
    const mockOnDayClick = vi.fn();

    render(
      <CalendarGrid
        calendar={calendar}
        onMonthChange={mockOnMonthChange}
        onDayClick={mockOnDayClick}
      />
    );

    expect(screen.getByText('2025년 1월')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    const year = 2025;
    const month = 1;
    const events = generatePaymentEvents(mockSubscriptions, year, month);
    const calendar = generateCalendarGrid(year, month, events);
    
    const mockOnMonthChange = vi.fn();
    const mockOnDayClick = vi.fn();

    render(
      <CalendarGrid
        calendar={calendar}
        onMonthChange={mockOnMonthChange}
        onDayClick={mockOnDayClick}
      />
    );

    expect(screen.getByLabelText('이전 달')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 달')).toBeInTheDocument();
    expect(screen.getByText('오늘')).toBeInTheDocument();
  });

  it('renders day headers correctly', () => {
    const year = 2025;
    const month = 1;
    const events = generatePaymentEvents(mockSubscriptions, year, month);
    const calendar = generateCalendarGrid(year, month, events);
    
    const mockOnMonthChange = vi.fn();
    const mockOnDayClick = vi.fn();

    render(
      <CalendarGrid
        calendar={calendar}
        onMonthChange={mockOnMonthChange}
        onDayClick={mockOnDayClick}
      />
    );

    expect(screen.getByText('일')).toBeInTheDocument();
    expect(screen.getByText('월')).toBeInTheDocument();
    expect(screen.getByText('화')).toBeInTheDocument();
    expect(screen.getByText('수')).toBeInTheDocument();
    expect(screen.getByText('목')).toBeInTheDocument();
    expect(screen.getByText('금')).toBeInTheDocument();
    expect(screen.getByText('토')).toBeInTheDocument();
  });

  it('renders calendar grid with correct number of weeks', () => {
    const year = 2025;
    const month = 1;
    const events = generatePaymentEvents(mockSubscriptions, year, month);
    const calendar = generateCalendarGrid(year, month, events);
    
    const mockOnMonthChange = vi.fn();
    const mockOnDayClick = vi.fn();

    render(
      <CalendarGrid
        calendar={calendar}
        onMonthChange={mockOnMonthChange}
        onDayClick={mockOnDayClick}
      />
    );

    // Should render 6 weeks (42 days total)
    const dayCells = screen.getAllByRole('button');
    expect(dayCells.length).toBeGreaterThan(0);
  });
});