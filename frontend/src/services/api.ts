// Módulo central de autenticação do client.
// Fonte única de verdade para o token JWT (armazenado no localStorage).

const TOKEN_KEY = 'cinema_token';

export const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

/** Header de autorização a ser injetado nas requisições (vazio se não houver token). */
export const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Em caso de 401 (ex.: token expirado): limpa o token e recarrega para obter um novo. */
export const handleUnauthorized = (): void => {
  clearToken();
  window.location.reload();
};
