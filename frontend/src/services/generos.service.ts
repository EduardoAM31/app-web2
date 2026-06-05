import { type IGenero } from '../models/genero.model';
import { authHeaders, handleUnauthorized } from './api';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/generos`;

export class GenerosService {
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

  async findAll(): Promise<IGenero[]> {
    return this.request<IGenero[]>('');
  }

  async findById(id: number | string): Promise<IGenero> {
    this.validateId(id);
    return this.request<IGenero>(`/${id}`);
  }

  async create(genero: Omit<IGenero, 'id'>): Promise<IGenero> {
    return this.request<IGenero>('', {
      method: 'POST',
      body: JSON.stringify(genero),
    });
  }

  async update(id: number | string, genero: Partial<IGenero>): Promise<IGenero> {
    this.validateId(id);

    const { id: _ignored, ...data } = genero;

    return this.request<IGenero>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number | string): Promise<void> {
    this.validateId(id);
    await this.request(`/${id}`, { method: 'DELETE' });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID do gênero é obrigatório e inválido.');
  }
}

export const generosService = new GenerosService();