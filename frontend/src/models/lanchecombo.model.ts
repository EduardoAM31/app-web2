import { z } from 'zod';

export interface ILancheCombo {
  id: string | number;
  nome: string;
  descricao: string;
  preco: number;
  itens?: string;
  qtUnidade?: number;
  subtotal?: number;
}

export const lancheComboSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  nome: z.string().min(1, 'O nome é obrigatório'),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  preco: z.coerce.number().min(0, 'O preço não pode ser negativo'),
  itens: z.string().optional(),
  qtUnidade: z.coerce.number().positive().optional(),
  subtotal: z.coerce.number().min(0).optional(),
});