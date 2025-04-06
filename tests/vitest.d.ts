/// <reference types="vitest" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}

// Para o TypeScript reconhecer os matchers do jest-dom
declare module '@testing-library/jest-dom' {
  export {};
}

// Para resolver os problemas com o matchMedia
interface MediaQueryList {
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

// Para resolver problemas com o ResizeObserver
interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

declare global {
  var ResizeObserver: {
    prototype: ResizeObserver;
    new(callback: ResizeObserverCallback): ResizeObserver;
  };
}

// Para o afterEach do Vitest
declare const afterEach: (fn: () => void) => void; 