import type { IFilme } from './filme.model';
import type { ISala } from './sala.model';
import { z } from 'zod';

export interface ISessao {
  id: string | number;
  horarioInicio: Date | string;
  valorIngresso: number;
  filmeId: string | number;
  salaId: string | number;
  filme?: IFilme;
  sala?: ISala;
}

export const sessaoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  filmeId: z.union([
    z.string().min(1, 'Selecione um filme'),
    z.number().positive('Selecione um filme'),
  ]),
  salaId: z.union([
    z.string().min(1, 'Selecione uma sala'),
    z.number().positive('Selecione uma sala'),
  ]),
  horarioInicio: z
    .string()
    .min(1, 'Informe a data e hora da sessão')
    .refine((value) => {
      const data = new Date(value);
      return !Number.isNaN(data.getTime());
    }, {
      message: 'Informe uma data válida',
    }),
  valorIngresso: z.coerce.number().min(0, 'O valor do ingresso não pode ser negativo'),
});