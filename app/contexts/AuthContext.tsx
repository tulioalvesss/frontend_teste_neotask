import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { isAuthenticated, isAdmin } from '~/services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  checkAuthStatus: () => boolean;
  isHydrated: boolean;
  isUserAdmin: boolean;
  refreshAuthState: () => void;
}

// Criar um evento customizado para notificar mudanças no estado de autenticação
const AUTH_STATE_CHANGE_EVENT = 'auth-state-change';

// Valor inicial para o contexto - não verifica autenticação na renderização inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para controlar se estamos no cliente e já fizemos a hidratação
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  
  // Usar um ref para evitar loops infinitos
  const isRefreshingRef = useRef(false);

  // Função para atualizar o estado de autenticação
  const refreshAuthState = useCallback(() => {
    // Evita chamadas recursivas
    if (isRefreshingRef.current) return false;
    
    if (!isHydrated) return false;
    
    try {
      isRefreshingRef.current = true;
      
      const authStatus = isAuthenticated();
      setLoggedIn(authStatus);
      
      if (authStatus) {
        const adminStatus = isAdmin();
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
      
      return authStatus;
    } finally {
      isRefreshingRef.current = false;
      
      // Dispara um evento customizado para notificar outros componentes
      // Move a dispatch do evento para fora do try/finally para evitar loops
      if (typeof window !== 'undefined') {
        // Usa setTimeout para adiar a execução e quebrar potenciais cadeias de chamadas
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT));
        }, 0);
      }
    }
  }, [isHydrated]);

  // Verifica o status de autenticação apenas no cliente após a montagem do componente
  useEffect(() => {
    setIsHydrated(true);
    
    // Chama refreshAuthState uma vez na montagem
    if (!isRefreshingRef.current) {
      refreshAuthState();
    }
  }, []);
  
  // Efeito separado para os listeners de eventos
  useEffect(() => {
    if (!isHydrated) return;
    
    // Adiciona um listener para o evento de mudança de autenticação
    const handleAuthChange = () => {
      // Evita chamadas recursivas
      if (!isRefreshingRef.current) {
        refreshAuthState();
      }
    };
    
    // Função para lidar com mudanças no localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken' || event.key === 'role') {
        if (!isRefreshingRef.current) {
          refreshAuthState();
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange);
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [isHydrated, refreshAuthState]);

  // Função para verificar o status de autenticação
  const checkAuthStatus = useCallback((): boolean => {
    if (isRefreshingRef.current) return isLoggedIn;
    return refreshAuthState();
  }, [refreshAuthState, isLoggedIn]);

  const contextValue = {
    isLoggedIn,
    setLoggedIn: (value: boolean) => {
      setLoggedIn(value);
      if (!value) {
        setIsUserAdmin(false);
      }
      
      // Dispara o evento para notificar outros componentes
      if (typeof window !== 'undefined' && !isRefreshingRef.current) {
        // Usa setTimeout para adiar a execução e quebrar potenciais cadeias de chamadas
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT));
        }, 0);
      }
    },
    checkAuthStatus,
    isHydrated,
    isUserAdmin,
    refreshAuthState
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 