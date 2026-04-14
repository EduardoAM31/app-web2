import { z } from 'zod';
import type { IGenero } from './genero.model';

export interface IFilme {
  id: string | number;
  titulo: string;
  sinopse?: string;
  classificacaoEtaria: string;
  duracao: number;
  generoId: string | number;
  genero?: IGenero;
}

export const filmeSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  titulo: z.string().min(1, 'O título é obrigatório'),
  sinopse: z.string().optional(),
  classificacaoEtaria: z.string().min(1, 'A classificação etária é obrigatória'),
  duracao: z.coerce.number().positive('A duração deve ser maior que 0'),
  generoId: z.union([
    z.string().min(1, 'Selecione um gênero'),
    z.number().positive('Selecione um gênero'),
  ]),
});