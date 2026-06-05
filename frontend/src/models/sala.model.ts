export interface ISala {
  id: string | number;
  numero: number;
  fileiras: number;
  colunas: number;
}

/** Gera os rótulos dos assentos (A1, A2, ...) a partir da matriz da sala. */
export function gerarAssentos(fileiras: number, colunas: number): string[] {
  const assentos: string[] = [];
  for (let f = 0; f < fileiras; f++) {
    const letra = String.fromCharCode(65 + f);
    for (let c = 1; c <= colunas; c++) {
      assentos.push(`${letra}${c}`);
    }
  }
  return assentos;
}
