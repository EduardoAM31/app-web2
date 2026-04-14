import { type ILancheCombo } from '../models/lanchecombo.model';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/lanche-combos`;

export class LancheComboService {
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

  async findAll(): Promise<ILancheCombo[]> {
    return this.request<ILancheCombo[]>('');
  }

  async findById(id: number | string): Promise<ILancheCombo> {
    this.validateId(id);
    return this.request<ILancheCombo>(`/${id}`);
  }

  async create(lanche: Omit<ILancheCombo, 'id'>): Promise<ILancheCombo> {
    return this.request<ILancheCombo>('', {
      method: 'POST',
      body: JSON.stringify(lanche),
    });
  }

  async update(id: number | string, lanche: Partial<ILancheCombo>): Promise<ILancheCombo> {
    this.validateId(id);

    const { id: _ignored, ...data } = lanche;

    return this.request<ILancheCombo>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number | string): Promise<void> {
    this.validateId(id);
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
  }

  private validateId(id: number | string): void {
    if (!id) {
      throw new Error('O ID do lanche é obrigatório e inválido.');
    }
  }
}

export const lancheComboService = new LancheComboService();