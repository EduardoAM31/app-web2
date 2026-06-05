import { type IIngresso } from '../models/ingresso.model';
import { authHeaders, handleUnauthorized } from './api';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/ingressos`;

export class IngressosService {
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

  async findAll(): Promise<IIngresso[]> {
    return this.request<IIngresso[]>('');
  }

  async findById(id: number | string): Promise<IIngresso> {
    this.validateId(id);
    return this.request<IIngresso>(`/${id}`);
  }

  async create(ingresso: Omit<IIngresso, 'id'>): Promise<IIngresso> {
    return this.request<IIngresso>('', {
      method: 'POST',
      body: JSON.stringify(ingresso),
    });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID do ingresso é obrigatório e inválido.');
  }
}

export const ingressosService = new IngressosService();