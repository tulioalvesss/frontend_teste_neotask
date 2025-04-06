import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import api from '~/services/api';

// Mock do axios
vi.mock('axios', () => ({
  create: vi.fn(() => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }))
}));

describe('API Service', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('cria uma instância do axios com a baseURL correta', () => {
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'http://127.0.0.1:8000/api',
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
  });

  it('adiciona o token de autorização quando disponível', async () => {
    // Capturar a função de interceptação configurada no arquivo api.ts
    const interceptor = (axios.create as any).mock.results[0].value.interceptors.request.use.mock.calls[0][0];
    
    // Configurar o localStorage com um token
    localStorage.setItem('authToken', 'test-token');
    
    // Simular uma requisição
    const config = { headers: {} };
    const result = interceptor(config);
    
    // Verificar se o token foi adicionado ao cabeçalho
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('não adiciona cabeçalho de autorização quando o token não existe', async () => {
    // Capturar a função de interceptação
    const interceptor = (axios.create as any).mock.results[0].value.interceptors.request.use.mock.calls[0][0];
    
    // Simular uma requisição sem token no localStorage
    const config = { headers: {} };
    const result = interceptor(config);
    
    // Verificar que o Authorization não foi adicionado
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('intercepta e trata erros na resposta', async () => {
    // Capturar o manipulador de erros da resposta
    const successHandler = (axios.create as any).mock.results[0].value.interceptors.response.use.mock.calls[0][0];
    const errorHandler = (axios.create as any).mock.results[0].value.interceptors.response.use.mock.calls[0][1];
    
    // Verificar manipulador de sucesso
    const response = { data: { success: true } };
    expect(successHandler(response)).toBe(response);
    
    // Preparar erro para testar manipulador de erro
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = {
      config: { url: '/test', method: 'GET' },
      response: { status: 404 },
      message: 'Not Found'
    };
    
    // Verificar que o erro é rejeitado corretamente
    await expect(errorHandler(error)).rejects.toBe(error);
    
    // Verificar que o erro foi logado
    expect(consoleErrorMock).toHaveBeenCalled();
    
    // Limpar o mock
    consoleErrorMock.mockRestore();
  });
}); 