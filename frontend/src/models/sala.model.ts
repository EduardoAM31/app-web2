export interface ISala {
  id: string | number;
  numero: number;
  capacidade: number;
  poltronas?: number[][];
}