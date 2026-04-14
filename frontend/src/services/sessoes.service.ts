import { type ISessao } from '../models/sessao.model';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/sessoes`;

export class SessoesService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = { 'Content-Type': 'application/json' };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorMessage = await response.text().catch(() => response.statusText);
        throw new Error(`Erro API (${response.status}): ${errorMessage}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error);
      throw error;
    }
  }

  async findAll(): Promise<ISessao[]> {
    return this.request<ISessao[]>('');
  }

  async findById(id: number | string): Promise<ISessao> {
    this.validateId(id);
    return this.request<ISessao>(`/${id}`);
  }

  async create(sessao: Omit<ISessao, 'id'>): Promise<ISessao> {
    return this.request<ISessao>('', {
      method: 'POST',
      body: JSON.stringify(sessao),
    });
  }

  async update(id: number | string, sessao: Partial<ISessao>): Promise<ISessao> {
    this.validateId(id);

    const { id: _ignored, ...data } = sessao;

    return this.request<ISessao>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number | string): Promise<void> {
    this.validateId(id);
    await this.request(`/${id}`, { method: 'DELETE' });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID da sessão é obrigatório e inválido.');
  }
}

export const sessoesService = new SessoesService();