import axios from 'axios';

// Verifica se estamos no ambiente do navegador
const isBrowser = typeof window !== 'undefined';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // ajuste a porta conforme seu backend
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  // Só tenta acessar localStorage no navegador
  if (isBrowser) {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Erro ao acessar token no localStorage:', e);
    }
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    // Só registra erros detalhados no navegador
    if (isBrowser) {
      console.error('Erro na requisição:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);

export default api; 