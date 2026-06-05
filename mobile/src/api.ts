import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import type { ComprovanteData, Pedido } from './types';

/**
 * Resolve a URL da API sem precisar fixar um IP no código:
 *  1) EXPO_PUBLIC_API_URL (arquivo .env, no .gitignore) — para produção ou IP fixo;
 *  2) em dev, reaproveita o IP pelo qual o app já fala com o Metro/Expo
 *     (o IP do seu PC, porta 3000) — funciona em celular físico e emulador;
 *  3) fallback localhost (simulador iOS / web).
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  const host = (Constants.expoConfig?.hostUri ?? '').split(':')[0];
  if (host) return `http://${host}:3000`;

  return 'http://localhost:3000';
}

export const API_URL = resolveApiUrl();

export const TOKEN_KEY = 'cinemagyn_token';
export const USER_KEY = 'cinemagyn_user';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor de request: injeta Authorization: Bearer <token>.
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Permite que o AuthContext reaja ao 401 (resetar estado + navegar).
let onUnauthorized: (() => void | Promise<void>) | null = null;
export const setUnauthorizedHandler = (fn: (() => void | Promise<void>) | null) => {
  onUnauthorized = fn;
};

// Interceptor de response: 401 → limpa token e volta para o login.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      if (onUnauthorized) {
        await onUnauthorized();
      } else {
        router.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Envia uma compra para a API: cria o ingresso e, em seguida, o pedido.
 * Retorna o pedido criado (com id e valorTotal).
 */
export async function enviarCompraRemota(dados: ComprovanteData): Promise<Pedido> {
  // Cria um ingresso por assento selecionado.
  const ingressoIds: number[] = [];
  for (const a of dados.assentos) {
    const { data: ingresso } = await api.post('/ingressos', {
      sessaoId: dados.sessaoId,
      tipo: a.tipo,
      valorPago: a.valor,
      assento: a.assento,
    });
    ingressoIds.push(ingresso.id);
  }

  const lanches = dados.lanches.map((l) => ({
    lancheComboId: l.lancheComboId,
    quantidade: l.quantidade,
  }));

  const { data: pedido } = await api.post('/pedidos', {
    ingressoIds,
    ...(lanches.length ? { lanches } : {}),
  });

  return pedido as Pedido;
}
