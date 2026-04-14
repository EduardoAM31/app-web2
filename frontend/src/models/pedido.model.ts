import { z } from 'zod';
import type { IIngresso } from './ingresso.model';
import type { ILancheCombo } from './lanchecombo.model';

export interface IPedidoLancheItem {
  lancheComboId: string | number;
  quantidade: number;
  lancheCombo?: ILancheCombo;
}

export interface IPedido {
  id: string | number;
  valorTotal: number;
  dataHora?: Date | string;
  ingressoIds?: Array<string | number>;
  lanches?: IPedidoLancheItem[];
  ingressos?: IIngresso[];
}

export const pedidoLancheItemSchema = z.object({
  lancheComboId: z.union([
    z.string().min(1, 'Selecione um lanche/combo'),
    z.number().positive('Selecione um lanche/combo'),
  ]),
  quantidade: z.coerce.number().positive('A quantidade deve ser maior que 0'),
});

export const pedidoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  valorTotal: z.coerce.number().min(0).optional(),
  dataHora: z.union([z.string(), z.date()]).optional(),
  ingressoIds: z.array(z.union([z.string(), z.number()])).optional(),
  lanches: z.array(pedidoLancheItemSchema).optional(),
}).refine(
  (data) =>
    (data.ingressoIds && data.ingressoIds.length > 0) ||
    (data.lanches && data.lanches.length > 0),
  {
    message: 'O pedido deve conter ao menos um item',
    path: ['ingressoIds'],
  },
);