import { PartidaInfo } from "./types";

/** Formata dd/mm/aaaa a partir do valor de um <input type="date"> (yyyy-mm-dd). */
export function formatData(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/**
 * Título de exibição: "Partida (data)" — exatamente como o analista digitou,
 * já que aqui é texto livre (ex: "Time M x Time R").
 */
export function tituloPartida(p: PartidaInfo): string {
  const base = p.partida || "Nova análise";
  return p.data ? `${base} (${formatData(p.data)})` : base;
}

/** Linha secundária com foco/treinador/motivo, pra mostrar embaixo do título. */
export function subtituloPartida(p: PartidaInfo): string {
  const partes: string[] = [];
  if (p.timeFoco) partes.push(`Foco: ${p.timeFoco}`);
  if (p.treinador) partes.push(`Treinador: ${p.treinador}`);
  if (p.motivo) partes.push(p.motivo);
  return partes.join(" · ");
}

/** Nome de arquivo seguro pra exportação, derivado da ficha. */
export function nomeArquivo(p: PartidaInfo): string {
  const base = [p.partida, p.data].filter(Boolean).join("_") || "analise";
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/_+/g, "_");
}
