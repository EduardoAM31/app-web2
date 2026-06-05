import type { ISessao } from './sessao.model';
import { z } from 'zod';

export type TipoIngresso = 'INTEIRA' | 'MEIA';

export interface IIngresso {
  id: string | number;
  sessaoId: string | number;
  tipo: TipoIngresso;
  valorPago: number;
  assento: string;
  sessao?: ISessao;
}

export const ingressoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  sessaoId: z.union([
    z.string().min(1, 'Selecione uma sessão'),
    z.number().positive('Selecione uma sessão'),
  ]),
  tipo: z.enum(['INTEIRA', 'MEIA']).refine(
    (value) => value === 'INTEIRA' || value === 'MEIA',
    'Selecione um tipo de ingresso',
  ),
  valorPago: z.coerce.number().min(0, 'O valor pago não pode ser negativo'),
  assento: z.string().min(1, 'Selecione um assento'),
});
