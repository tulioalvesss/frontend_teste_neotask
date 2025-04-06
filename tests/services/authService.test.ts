import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authService from '~/services/authService';
import api from '~/services/api';

// Mock do módulo axios
vi.mock('~/services/api', () => ({
  default: {
    post: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn()
      },
      response: {
        use: vi.fn()
      }
    }
  }
}));

describe('authService', () => {
  beforeEach(() => {
    // Limpar o localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    // Redefinir todos os mocks
    vi.resetAllMocks();
  });

  describe('isAuthenticated', () => {
    it('retorna false quando não há token no localStorage', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('retorna true quando há token no localStorage', () => {
      localStorage.setItem('authToken', 'fake-token');
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('retorna false quando não há role no localStorage', () => {
      expect(authService.isAdmin()).toBe(false);
    });

    it('retorna true quando a role é admin', () => {
      localStorage.setItem('role', 'admin');
      expect(authService.isAdmin()).toBe(true);
    });

    it('retorna true quando a role é ADMIN (maiúsculo)', () => {
      localStorage.setItem('role', 'ADMIN');
      expect(authService.isAdmin()).toBe(true);
    });

    it('retorna false quando a role não é admin', () => {
      localStorage.setItem('role', 'user');
      expect(authService.isAdmin()).toBe(false);
    });
  });

  describe('login', () => {
    it('armazena o token após login bem-sucedido', async () => {
      const mockResponse = {
        data: {
          access_token: 'fake-token',
          role: 'user'
        }
      };

      (api.post as any).mockResolvedValue(mockResponse);

      await authService.login({ email: 'teste@exemplo.com', password: 'senha123' });

      expect(api.post).toHaveBeenCalledWith('auth/login', {
        email: 'teste@exemplo.com',
        password: 'senha123'
      });
      
      expect(localStorage.getItem('authToken')).toBe('fake-token');
      expect(localStorage.getItem('role')).toBe('user');
    });

    it('lança erro quando a resposta não contém token', async () => {
      const mockResponse = {
        data: {}
      };

      (api.post as any).mockResolvedValue(mockResponse);

      await expect(
        authService.login({ email: 'teste@exemplo.com', password: 'senha123' })
      ).rejects.toThrow('Resposta inválida do servidor');
    });

    it('lança erro quando o servidor retorna erro', async () => {
      (api.post as any).mockRejectedValue(new Error('Erro de servidor'));

      await expect(
        authService.login({ email: 'teste@exemplo.com', password: 'senha123' })
      ).rejects.toThrow('Falha na autenticação');
    });
  });

  describe('logout', () => {
    it('remove token e role do localStorage', () => {
      // Configurar localStorage com dados de autenticação
      localStorage.setItem('authToken', 'fake-token');
      localStorage.setItem('role', 'admin');

      // Executar logout
      authService.logout();

      // Verificar se os itens foram removidos
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('retorna null quando não há token', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('retorna o token quando ele existe', () => {
      localStorage.setItem('authToken', 'fake-token');
      expect(authService.getToken()).toBe('fake-token');
    });
  });
}); 