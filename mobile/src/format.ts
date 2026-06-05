// Formatadores sem depender de Intl/ICU (Hermes no Android pode não ter locale completo).

export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function formatarMoeda(v: number): string {
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
}
