import { vi } from 'vitest'

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  },
  writable: true
})

// Mock PerformanceObserver
Object.defineProperty(window, 'PerformanceObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => [])
  })),
  writable: true
})

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    connection: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false
    }
  },
  writable: true
})

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    getRegistrations: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  writable: true
})