"use client";

import { X, ClipboardList } from "lucide-react";
import { PartidaInfo } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  value: PartidaInfo;
  onChange: (value: PartidaInfo) => void;
};

const campo = "w-full rounded-md border border-line bg-panel2 px-3 py-2 text-sm outline-none";
const label = "mb-1 block text-xs font-semibold text-dim";

export default function FichaPartida({ open, onClose, value, onChange }: Props) {
  if (!open) return null;

  const set = (patch: Partial<PartidaInfo>) => onChange({ ...value, ...patch });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-line bg-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-sm font-semibold">
            <ClipboardList size={16} /> Ficha da Partida
          </div>
          <button onClick={onClose} className="text-dim">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className={label}>Partida</label>
            <input
              placeholder="Time M x Time R"
              className={campo}
              value={value.partida}
              onChange={(e) => set({ partida: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>Data da partida</label>
            <input type="date" className={campo} value={value.data} onChange={(e) => set({ data: e.target.value })} />
          </div>

          <div>
            <label className={label}>Time a analisar</label>
            <input
              placeholder="Time R"
              className={campo}
              value={value.timeFoco}
              onChange={(e) => set({ timeFoco: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>Treinador</label>
            <input
              placeholder="José"
              className={campo}
              value={value.treinador}
              onChange={(e) => set({ treinador: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>Motivo</label>
            <input
              placeholder="Análise do Time R, possível adversário nas quartas"
              className={campo}
              value={value.motivo}
              onChange={(e) => set({ motivo: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>Contexto</label>
            <textarea
              rows={5}
              placeholder="Jogo no início da Liga, tempo chuvoso e adversário fica com um jogador a menos antes do intervalo..."
              className={campo}
              value={value.contexto}
              onChange={(e) => set({ contexto: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-dim">
          Preenchida a qualquer momento — nada aqui trava o início da análise.
        </div>
      </aside>
    </div>
  );
}
