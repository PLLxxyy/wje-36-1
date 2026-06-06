import React from 'react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

vi.mock('echarts-for-react', () => ({
  default: ({ option }: { option: any }) => (
    <div
      data-testid="echarts-mock"
      data-chart-title={option.title?.text || ''}
      data-series={JSON.stringify(option.series?.map((s: any) => s.name) || [])}
    />
  ),
}));
