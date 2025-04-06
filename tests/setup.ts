import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Mock do localStorage para testes
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Disponibiliza o localStorage no ambiente de testes
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Desabilita alguns warnings do ResizeObserver durante os testes
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// @ts-ignore - Para ignorar erros de tipo no ResizeObserver global
global.ResizeObserver = ResizeObserverMock;

// Mock para window.matchMedia que é usado por alguns componentes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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

// Mock para eventos do DOM
// @ts-ignore - Para ignorar erros de tipo no CustomEvent
global.CustomEvent = class CustomEventMock extends Event {
  constructor(name: string, options?: any) {
    super(name, options);
    this.detail = options?.detail;
  }
  detail: any;
};

// Limpar todos os mocks depois de cada teste
afterEach(() => {
  vi.clearAllMocks();
}); 