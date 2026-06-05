import { type ISala } from '../models/sala.model';
import { authHeaders, handleUnauthorized } from './api';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/salas`;

export class SalasService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = { 'Content-Type': 'application/json', ...authHeaders() };

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
        if (response.status === 401) handleUnauthorized();
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

  async findAll(): Promise<ISala[]> {
    return this.request<ISala[]>('');
  }

  async findById(id: number | string): Promise<ISala> {
    this.validateId(id);
    return this.request<ISala>(`/${id}`);
  }

  async create(sala: Omit<ISala, 'id'>): Promise<ISala> {
    return this.request<ISala>('', {
      method: 'POST',
      body: JSON.stringify(sala),
    });
  }

  async update(id: number | string, sala: Partial<ISala>): Promise<ISala> {
    this.validateId(id);

    const { id: _ignored, ...data } = sala;

    return this.request<ISala>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number | string): Promise<void> {
    this.validateId(id);
    await this.request(`/${id}`, { method: 'DELETE' });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID da sala é obrigatório e inválido.');
  }
}

export const salasService = new SalasService();