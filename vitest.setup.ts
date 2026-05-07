import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
// التعديل الجوهري هنا: استخدام المسار المتوافق مع Vitest
import '@testing-library/jest-dom/vitest';

// تنظيف البيئة بعد كل اختبار لضمان استقرار النتائج
afterEach(() => {
  cleanup();
});

// محاكاة الخصائص التي يفتقدها متصفح الاختبار (JSDOM)
if (typeof window !== 'undefined') {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // قديم
      removeListener: vi.fn(), // قديم
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // إضافة محاكاة لـ ResizeObserver إذا احتاجتها الواجهة
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}