"use client";

import { BotoneraConfig } from "@/lib/types";

const TONS: Record<string, { bg: string; bd: string; fg: string; head: string }> = {
  green: { bg: "rgba(143,209,79,0.10)", bd: "rgba(143,209,79,0.35)", fg: "#B7E894", head: "#8FD14F" },
  teal: { bg: "rgba(79,209,184,0.10)", bd: "rgba(79,209,184,0.35)", fg: "#9CE9DB", head: "#4FD1B8" },
  purple: { bg: "rgba(176,143,224,0.10)", bd: "rgba(176,143,224,0.35)", fg: "#D3C0F0", head: "#B08FE0" },
  amber: { bg: "rgba(232,163,61,0.10)", bd: "rgba(232,163,61,0.35)", fg: "#F3CE94", head: "#E8A33D" },
  red: { bg: "rgba(224,90,90,0.10)", bd: "rgba(224,90,90,0.35)", fg: "#F3A9A9", head: "#E05A5A" },
  gray: { bg: "rgba(255,255,255,0.05)", bd: "rgba(255,255,255,0.18)", fg: "#D6DBD2", head: "#9AA69A" },
};

type Props = {
  config: BotoneraConfig;
  contagem: Record<string, number>;
  flashKey: string | null;
  disabled: boolean;
  onAction: (grupo: string, acao: string) => void;
};

export default function Botonera({ config, contagem, flashKey, disabled, onAction }: Props) {
  return (
    <div className="flex max-h-[calc(100vh-100px)] flex-col gap-3 overflow-y-auto pr-1">
      {config.grupos.map((g) => {
        const tom = TONS[g.tom] ?? TONS.gray;
        return (
          <div key={g.nome} className="rounded-xl border bg-panel p-3" style={{ borderColor: tom.bd }}>
            <div
              className="mb-2 font-display text-xs font-semibold uppercase tracking-wide"
              style={{ color: tom.head }}
            >
              {g.nome}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-1.5">
              {g.acoes.map((acao) => {
                const key = g.nome + "|" + acao;
                const count = contagem[key] || 0;
                const flashing = flashKey === key;
                return (
                  <button
                    key={acao}
                    disabled={disabled}
                    onClick={() => onAction(g.nome, acao)}
                    className="flex items-center justify-between gap-1.5 rounded-md border px-2.5 py-2 text-xs font-medium transition-shadow disabled:opacity-35"
                    style={{
                      background: tom.bg,
                      borderColor: tom.bd,
                      color: tom.fg,
                      boxShadow: flashing ? `0 0 0 2px ${tom.head}` : "none",
                    }}
                  >
                    <span>{acao}</span>
                    <span
                      className="flex h-[18px] min-w-[18px] items-center justify-center rounded font-mono text-[11px] font-bold text-bg"
                      style={{ background: tom.head }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
