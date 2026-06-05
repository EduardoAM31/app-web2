import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { requestToken } from '../services/auth.service';
import { getToken, setToken } from '../services/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  /** true quando já temos um token ou a tentativa de obtê-lo terminou. */
  ready: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTok] = useState<string | null>(() => getToken());
  const [ready, setReady] = useState<boolean>(() => !!getToken());

  // Sem login: ao montar, se ainda não houver token, solicita um ao backend.
  useEffect(() => {
    if (token) return;
    let cancelled = false;
    requestToken()
      .then((data) => {
        if (cancelled) return;
        setToken(data.access_token);
        setTok(data.access_token);
      })
      .catch((err) => console.error('Falha ao obter token JWT:', err))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
