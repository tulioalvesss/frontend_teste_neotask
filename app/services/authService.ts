import api from './api';

// Helper para verificar se estamos no ambiente do navegador
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const isAuthenticated = (): boolean => {
  if (!isBrowser()) {
    return false; // Durante SSR, sempre retorna false
  }
  
  try {
    return !!localStorage.getItem('authToken');
  } catch (e) {
    // Em caso de erro de acesso ao localStorage (como em iframes com política de cookies)
    console.error('Erro ao acessar localStorage:', e);
    return false;
  }
};

export const isAdmin = (): boolean => {
  if (!isBrowser()) {
    return false; // Durante SSR, sempre retorna false
  }
  
  try {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' || role === 'admin';
  } catch (e) {
    console.error('Erro ao acessar localStorage para verificar role:', e);
    return false;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  if (!isBrowser()) {
    throw new Error('Login só pode ser realizado no navegador');
  }
  
  try {
    const response = await api.post('auth/login', {
      email: credentials.email,
      password: credentials.password
    });

    // Validação da resposta
    if (!response.data || !response.data.access_token) {
      throw new Error('Resposta inválida do servidor');
    }

    // Armazenar o token
    try {
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('role', response.data.role);
    } catch (e) {
      console.error('Erro ao armazenar dados no localStorage:', e);
      throw new Error('Não foi possível armazenar os dados de autenticação');
    }
    
    return true;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro na requisição de login:', error.message);
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
    throw new Error('Erro desconhecido durante o login');
  }
}

export const register = async (credentials: { email: string; password: string, name: string }) => {
  if (!isBrowser()) {
    throw new Error('Registro só pode ser realizado no navegador');
  }
  try {
    await api.post('auth/register', {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      role: 'user'
    });
    return true;
  } catch (error) {
    throw new Error('Falha ao registrar. Verifique suas credenciais.');
  }
}

export const logout = (): void => {
  if (!isBrowser()) {
    return; // Silenciosamente não faz nada durante SSR
  }
  
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  } catch (e) {
    console.error('Erro ao remover dados do localStorage:', e);
  }
};

export const getToken = (): string | null => {
  if (!isBrowser()) {
    return null; // Durante SSR, sempre retorna null
  }
  
  try {
    return localStorage.getItem('authToken');
  } catch (e) {
    console.error('Erro ao acessar token no localStorage:', e);
    return null;
  }
};