import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  AssentoSelecionado,
  LancheSelecionado,
  Sessao,
  TipoIngresso,
} from './types';

interface CompraState {
  sessao: Sessao | null;
  assentos: AssentoSelecionado[];
  lanches: LancheSelecionado[];
  setSessao: (s: Sessao) => void;
  toggleAssento: (a: string) => void;
  setTipoAssento: (a: string, tipo: TipoIngresso) => void;
  setLanches: (l: LancheSelecionado[]) => void;
  reset: () => void;
}

const CompraContext = createContext<CompraState | undefined>(undefined);

export function CompraProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessaoState] = useState<Sessao | null>(null);
  const [assentos, setAssentos] = useState<AssentoSelecionado[]>([]);
  const [lanches, setLanchesState] = useState<LancheSelecionado[]>([]);

  const reset = () => {
    setSessaoState(null);
    setAssentos([]);
    setLanchesState([]);
  };

  return (
    <CompraContext.Provider
      value={{
        sessao,
        assentos,
        lanches,
        // Iniciar uma nova sessão zera assentos e lanches.
        setSessao: (s) => {
          setSessaoState(s);
          setAssentos([]);
          setLanchesState([]);
        },
        // Marca/desmarca um assento (entra como INTEIRA por padrão).
        toggleAssento: (a) =>
          setAssentos((prev) =>
            prev.some((x) => x.assento === a)
              ? prev.filter((x) => x.assento !== a)
              : [...prev, { assento: a, tipo: 'INTEIRA' }],
          ),
        setTipoAssento: (a, tipo) =>
          setAssentos((prev) => prev.map((x) => (x.assento === a ? { ...x, tipo } : x))),
        setLanches: setLanchesState,
        reset,
      }}
    >
      {children}
    </CompraContext.Provider>
  );
}

export function useCompra() {
  const ctx = useContext(CompraContext);
  if (!ctx) throw new Error('useCompra deve ser usado dentro de CompraProvider');
  return ctx;
}
