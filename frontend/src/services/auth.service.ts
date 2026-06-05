import { API_ROOT } from './api';

export interface TokenResponse {
  access_token: string;
}

/** Solicita um token JWT ao backend (sem credenciais). Pode embutir dados no payload. */
export async function requestToken(payload?: Record<string, unknown>): Promise<TokenResponse> {
  const res = await fetch(`${API_ROOT}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Falha ao obter token (${res.status}): ${msg}`);
  }

  return res.json();
}
