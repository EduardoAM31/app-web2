import { type IFilme } from '../models/filme.model';
import { authHeaders, handleUnauthorized } from './api';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/filmes`;

export class FilmesService {
  private parseFilme(f: any): IFilme {
    return {
      ...f,
      duracao: typeof f.duracao === 'string' ? Number(f.duracao) : f.duracao,
    } as IFilme;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...authHeaders(),
    };

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
    } catch (error: any) {
      console.error(`Erro na requisição para ${url}:`, error);
      throw new Error(`Failed to fetch ${url}: ${error?.message ?? String(error)}`);
    }
  }

  async findAll(): Promise<IFilme[]> {
    const data = await this.request<IFilme[]>('');
    return data.map((f) => this.parseFilme(f));
  }

  async findById(id: number | string): Promise<IFilme> {
    this.validateId(id);
    const data = await this.request<IFilme>(`/${id}`);
    return this.parseFilme(data);
  }

  async create(filme: Partial<IFilme>): Promise<IFilme> {
    const resp = await this.request<IFilme>('', {
      method: 'POST',
      body: JSON.stringify(filme),
    });

    return this.parseFilme(resp);
  }

  async update(id: number | string, filme: Partial<IFilme>): Promise<IFilme> {
    this.validateId(id);

    const { id: _ignored, ...data } = filme;

    const resp = await this.request<IFilme>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    return this.parseFilme(resp);
  }

  async delete(id: number | string): Promise<void> {
    this.validateId(id);
    await this.request(`/${id}`, { method: 'DELETE' });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID do filme é obrigatório e inválido.');
  }
}

export const filmesService = new FilmesService();