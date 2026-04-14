import { type IPedido } from '../models/pedido.model';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT.replace(/\/$/, '')}/pedidos`;

export class PedidosService {
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

  async findAll(): Promise<IPedido[]> {
    return this.request<IPedido[]>('');
  }

  async findById(id: number | string): Promise<IPedido> {
    this.validateId(id);
    return this.request<IPedido>(`/${id}`);
  }

  async create(pedido: Omit<IPedido, 'id' | 'valorTotal' | 'dataHora'>): Promise<IPedido> {
    return this.request<IPedido>('', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  }

  private validateId(id: number | string): void {
    if (!id) throw new Error('O ID do pedido é obrigatório e inválido.');
  }
}

export const pedidosService = new PedidosService();