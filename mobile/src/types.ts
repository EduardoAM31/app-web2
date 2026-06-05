export interface Genero {
  id: number;
  nome: string;
}

export interface Filme {
  id: number;
  titulo: string;
  sinopse?: string | null;
  classificacaoEtaria: string;
  duracao: number;
  generoId: number;
  genero?: Genero;
}

export interface Sala {
  id: number;
  numero: number;
  fileiras: number;
  colunas: number;
}

export interface Sessao {
  id: number;
  filmeId: number;
  salaId: number;
  horarioInicio: string;
  valorIngresso: number;
  filme?: Filme;
  sala?: Sala;
}

export type TipoIngresso = 'INTEIRA' | 'MEIA';

export interface Ingresso {
  id: number;
  sessaoId: number;
  tipo: TipoIngresso;
  valorPago: number;
  assento?: string | null;
}

export interface LancheCombo {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  itens?: string | null;
}

export interface LancheSelecionado {
  lancheComboId: number;
  nome: string;
  preco: number;
  quantidade: number;
}

/** Assento escolhido durante a compra (estado em memória). */
export interface AssentoSelecionado {
  assento: string;
  tipo: TipoIngresso;
}

/** Assento já precificado, persistido no comprovante/SQLite. */
export interface AssentoComprado {
  assento: string;
  tipo: TipoIngresso;
  valor: number;
}

export interface Pedido {
  id: number;
  valorTotal: number;
  dataHora: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
}

/** Snapshot persistido no SQLite (coluna dados_json). */
export interface ComprovanteData {
  assentos: AssentoComprado[];
  sessaoId: number;
  filmeTitulo: string;
  horarioInicio: string;
  salaNumero: number | null;
  lanches: LancheSelecionado[];
  valorTotal: number;
  pedidoId: number | null;
}
