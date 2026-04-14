import { z } from 'zod';

export interface IGenero {
  id: string | number;
  nome: string;
}

export const generoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  nome: z.string().min(1, 'O nome do gênero é obrigatório'),
});