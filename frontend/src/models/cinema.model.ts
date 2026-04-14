import type { ISala } from "./sala.model";
import type { IFilme } from "./filme.model";
import type { ISessao } from "./sessao.model";

export interface ICinema {
    id: number;
    nome: string;
    endereco: string;
    listaSalas: ISala[];
    listaFilmes: IFilme[];
    listaSessoes: ISessao[];
}
