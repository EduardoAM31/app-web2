import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { api, TOKEN_KEY, USER_KEY, setUnauthorizedHandler } from './api';
import type { AuthUser } from './types';

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão salva no SecureStore ao iniciar.
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const savedUser = await SecureStore.getItemAsync(USER_KEY);
        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser) as AuthUser);
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Qualquer 401 vindo do axios → desloga e volta ao login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
      router.replace('/login');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const persist = async (newToken: string, newUser: AuthUser) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, password: senha });
    await persist(data.access_token, data.user);
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post('/users', { name: nome, email, password: senha });
    // Auto-login logo após o registro.
    await login(email, senha);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
