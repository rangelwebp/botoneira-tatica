"use client";

import { X, Download } from "lucide-react";
import { EventoRecorte } from "@/lib/types";
import { formatTime } from "@/lib/matchTime";

type Props = {
  events: EventoRecorte[];
  onSeek: (t: number) => void;
  onRemove?: (id: string) => void;
  onExport?: () => void;
  readOnly?: boolean;
};

export default function Timeline({ events, onSeek, onRemove, onExport, readOnly }: Props) {
  return (
    <div className="flex min-h-[220px] flex-1 flex-col rounded-xl border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5 text-xs font-semibold text-dim">
        <span>
          Linha do tempo · {events.length} recorte{events.length === 1 ? "" : "s"}
        </span>
        {onExport && (
          <button
            onClick={onExport}
            disabled={events.length === 0}
            className="flex items-center gap-1.5 rounded-md bg-[#8FD14F] px-2.5 py-1.5 text-xs font-bold text-bg disabled:opacity-40"
          >
            <Download size={13} /> Exportar análise
          </button>
        )}
      </div>
      <div className="max-h-[280px] overflow-y-auto">
        {events.length === 0 && (
          <div className="p-5 text-center text-xs text-dim">
            Clique num botão da botoneira pra marcar seu primeiro recorte.
          </div>
        )}
        {events.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[56px_120px_1fr_46px_22px] items-center gap-2 border-b border-line px-3 py-1.5 text-xs"
          >
            <button onClick={() => onSeek(e.tempo)} className="font-mono font-bold text-[#8FD14F]">
              {formatTime(e.tempo)}
            </button>
            <span className="truncate text-[11px] text-dim">{e.grupo}</span>
            <span className="truncate font-medium">{e.acao}</span>
            <span className="text-right font-mono text-[11px] text-dim">
              {e.minuto != null ? `${e.minuto}'` : e.meiaFinal || ""}
            </span>
            {!readOnly && onRemove ? (
              <button onClick={() => onRemove(e.id)} className="text-dim">
                <X size={13} />
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
