import { afterEach, vi } from 'vitest';

// Only run browser-specific setup when in jsdom environment
if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom');
  const { cleanup } = await import('@testing-library/react');

  // Cleanup after each test
  afterEach(() => {
    cleanup();
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
