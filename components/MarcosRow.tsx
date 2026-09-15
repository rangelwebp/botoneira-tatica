"use client";

import { Flag } from "lucide-react";
import { Marco, MarcosState } from "@/lib/types";
import { formatTime } from "@/lib/matchTime";

type Props = {
  marcos: Marco[];
  values: MarcosState;
  disabled: boolean;
  flashId: string | null;
  onMark: (marco: Marco) => void;
};

export default function MarcosRow({ marcos, values, disabled, flashId, onMark }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {marcos.map((m) => {
        const time = (values as any)[m.id] as number | null;
        const flashing = flashId === "marco-" + m.id;
        return (
          <button
            key={m.id}
            disabled={disabled}
            onClick={() => onMark(m)}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-line px-1.5 py-2.5 text-xs font-semibold disabled:opacity-40"
            style={{
              background: flashing ? "#8FD14F" : "#1D271C",
              color: flashing ? "#0F1710" : "#ECF1E7",
              borderColor: flashing ? "#8FD14F" : undefined,
            }}
          >
            <span className="flex items-center gap-1">
              <Flag size={12} /> {m.label}
            </span>
            {time != null && <span className="font-mono text-[10.5px] text-dim">{formatTime(time)}</span>}
          </button>
        );
      })}
    </div>
  );
}
