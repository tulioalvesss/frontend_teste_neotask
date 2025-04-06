import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '~/contexts/AuthContext';
import * as authService from '~/services/authService';

// Mock dos serviços de autenticação
vi.mock('~/services/authService', () => ({
  isAuthenticated: vi.fn(),
  isAdmin: vi.fn()
}));

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    // Configuração padrão para os mocks de autenticação
    (authService.isAuthenticated as any).mockReturnValue(false);
    (authService.isAdmin as any).mockReturnValue(false);
    
    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fornece valores de autenticação iniciais (não autenticado)', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isUserAdmin).toBe(false);
    expect(result.current.isHydrated).toBe(true); // Isso muda para true após useEffect
    expect(typeof result.current.setLoggedIn).toBe('function');
    expect(typeof result.current.refreshAuthState).toBe('function');
    expect(typeof result.current.checkAuthStatus).toBe('function');
  });

  it('atualiza estado quando setLoggedIn é chamado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Inicialmente não está logado
    expect(result.current.isLoggedIn).toBe(false);
    
    // Atualizar estado para logado
    act(() => {
      result.current.setLoggedIn(true);
    });
    
    // Verificar se o estado mudou
    expect(result.current.isLoggedIn).toBe(true);
  });

  it('verifica estado de autenticação quando checkAuthStatus é chamado', () => {
    // Configurar mock para retornar true
    (authService.isAuthenticated as any).mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Chamar a função de verificação de estado
    let authStatus;
    act(() => {
      authStatus = result.current.checkAuthStatus();
    });
    
    // Verificar se o resultado e o estado estão corretos
    expect(authStatus).toBe(true);
    expect(result.current.isLoggedIn).toBe(true);
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });

  it('atualiza o estado de admin quando o usuário está autenticado', () => {
    // Configurar mocks para retornar verdadeiro
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.isAdmin as any).mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Verificar se o estado de admin foi atualizado
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isUserAdmin).toBe(true);
  });

  it('reseta estado de admin quando o usuário faz logout', () => {
    // Primeiro configurar um usuário logado e admin
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.isAdmin as any).mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Verificar estado inicial
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isUserAdmin).toBe(true);
    
    // Fazer logout
    act(() => {
      result.current.setLoggedIn(false);
    });
    
    // Verificar se o estado de admin foi resetado
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isUserAdmin).toBe(false);
  });

  it('atualiza estado quando refreshAuthState é chamado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Estado inicial não autenticado
    expect(result.current.isLoggedIn).toBe(false);
    
    // Configurar mock para retornar true na próxima chamada
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.isAdmin as any).mockReturnValue(true);
    
    // Chamar refreshAuthState
    act(() => {
      result.current.refreshAuthState();
    });
    
    // Verificar se o estado foi atualizado
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isUserAdmin).toBe(true);
  });
}); 