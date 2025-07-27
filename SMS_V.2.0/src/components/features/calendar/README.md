# Calendar Feature Documentation

## Overview

The Calendar feature provides a comprehensive monthly view of subscription payment schedules with advanced visual indicators, hover effects, and responsive design. It's built with Tailwind UI premium components and incorporates glass morphism design elements from the Footer design guide.

## Features

### 🗓️ Monthly Calendar View
- **Grid Layout**: 7-column grid showing full month with proper date calculations
- **Navigation**: Arrow buttons to navigate between months
- **Today Button**: Quick navigation to current month
- **Responsive Design**: Container queries for adaptive layouts

### 💳 Payment Tracking
- **Service Icons**: Visual indicators for each subscription service
- **Payment Dates**: Automatic calculation based on billing cycles
- **Multiple Currencies**: Support for KRW and USD with exchange rate conversion
- **Payment Status**: Today, upcoming, and past payment highlighting

### 🎨 Visual Design
- **Glass Morphism**: Backdrop blur effects and transparent backgrounds
- **Color Coding**: Different colors for today, upcoming, and past payments
- **Hover Effects**: Detailed tooltips showing payment information
- **Service Icons**: Emoji-based icons with color-coded backgrounds

### 📱 Responsive Features
- **Container Queries**: Adaptive layouts based on container size
- **Mobile Optimized**: Touch-friendly interactions
- **Accessibility**: ARIA labels and keyboard navigation support

## Components

### Calendar.tsx (Main Page)
The main calendar page that orchestrates the entire calendar experience.

**Features:**
- Monthly calendar grid
- Right sidebar with payment summaries
- Today's payments section
- Weekly summary statistics
- Upcoming payments list

**Props:**
```typescript
interface CalendarProps {
  // No props - self-contained component
}
```

### CalendarGrid.tsx
The core calendar grid component that renders the monthly view.

**Features:**
- Monthly grid layout
- Service icons for payment dates
- Hover effects with payment details
- Today and upcoming payment highlighting
- Responsive design with container queries

**Props:**
```typescript
interface CalendarGridProps {
  calendar: CalendarGrid;
  onMonthChange: (year: number, month: number) => void;
  onDayClick?: (date: Date) => void;
  className?: string;
}
```

## Utility Functions

### calendar.ts
Comprehensive utility functions for calendar operations.

**Key Functions:**
- `generatePaymentEvents()`: Create calendar events from subscriptions
- `generateCalendarGrid()`: Generate calendar grid structure
- `calculatePaymentDates()`: Calculate payment dates based on billing cycles
- `getServiceIcon()`: Get service icon and color information
- `formatAmount()`: Format currency amounts
- `getTodayPayments()`: Get today's payment events
- `getWeeklyPayments()`: Get this week's payment events

**Interfaces:**
```typescript
interface CalendarEvent {
  id: string;
  date: Date;
  subscriptions: Subscription[];
  totalAmount: number;
  currency: string;
  isToday: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}

interface ServiceIcon {
  name: string;
  icon: string;
  color: string;
}
```

## Service Icons

The calendar supports a wide range of service icons with color coding:

| Service | Icon | Color |
|---------|------|-------|
| Netflix | 🎬 | Red |
| Spotify | 🎵 | Green |
| YouTube | 📺 | Red |
| ChatGPT | 🤖 | Green |
| GitHub | 💻 | Gray |
| Adobe | 🎨 | Purple |
| Microsoft | 💼 | Blue |
| Apple | 🍎 | Gray |
| Google | 🔍 | Blue |
| Amazon | 📦 | Orange |

## Design System Integration

### Glass Morphism Elements
- `bg-white/80 backdrop-blur-md`: Semi-transparent backgrounds
- `border border-white/30`: Subtle borders
- `shadow-xl`: Premium shadows

### Color System
- **Today**: Blue gradient (`from-blue-50 to-blue-100`)
- **Upcoming**: Yellow gradient (`from-yellow-50 to-yellow-100`)
- **Past**: Gray gradient (`from-gray-50 to-gray-100`)
- **Weekends**: Subtle gray tint

### Typography
- **Font**: Pretendard Variable Font
- **Korean Text**: `break-keep-ko` for proper word breaking
- **Tracking**: `tracking-ko-tight` for Korean text optimization

## Usage Examples

### Basic Calendar Implementation
```tsx
import { Calendar } from '../pages/Calendar';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Calendar />
    </div>
  );
}
```

### Custom Calendar Grid
```tsx
import { CalendarGrid } from '../components/features/calendar/CalendarGrid';
import { generateCalendarGrid, generatePaymentEvents } from '../utils/calendar';

function CustomCalendar({ subscriptions }) {
  const events = generatePaymentEvents(subscriptions, 2025, 1);
  const calendar = generateCalendarGrid(2025, 1, events);

  const handleMonthChange = (year, month) => {
    // Handle month navigation
  };

  const handleDayClick = (date) => {
    // Handle day click
  };

  return (
    <CalendarGrid
      calendar={calendar}
      onMonthChange={handleMonthChange}
      onDayClick={handleDayClick}
    />
  );
}
```

## Accessibility Features

### Keyboard Navigation
- Tab navigation through calendar days
- Enter/Space to select dates
- Arrow keys for month navigation

### Screen Reader Support
- ARIA labels for all interactive elements
- Descriptive text for payment information
- Hidden accessibility descriptions

### Visual Indicators
- High contrast colors for payment status
- Clear visual hierarchy
- Consistent spacing and sizing

## Performance Optimizations

### Efficient Rendering
- Virtual scrolling for large datasets
- Memoized calculations for payment dates
- Optimized re-renders with React.memo

### Data Management
- Lazy loading of subscription data
- Efficient date calculations
- Minimal state updates

## Testing

### Unit Tests
- Component rendering tests
- Utility function tests
- Date calculation validation

### Integration Tests
- Calendar navigation
- Payment event generation
- Responsive behavior

## Future Enhancements

### Planned Features
- [ ] Weekly view option
- [ ] Payment reminder notifications
- [ ] Export calendar data
- [ ] Custom service icons
- [ ] Dark mode support
- [ ] Calendar sharing

### Technical Improvements
- [ ] Performance optimizations
- [ ] Enhanced accessibility
- [ ] More responsive breakpoints
- [ ] Advanced filtering options

## Dependencies

### Core Dependencies
- React 19.1.0
- TypeScript 5.8.3
- Tailwind CSS 4.1.11
- Heroicons 2.2.0

### Development Dependencies
- Vitest 2.1.8
- @testing-library/react
- ESLint 9.30.1
- Prettier 3.3.3

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When contributing to the calendar feature:

1. Follow the existing code style and patterns
2. Add comprehensive tests for new functionality
3. Update documentation for any API changes
4. Ensure accessibility compliance
5. Test responsive behavior across devices

## License

This calendar feature is part of the Moonwave project and follows the same licensing terms.