"use client";

import { Play, Pause, Clock } from "lucide-react";
import { VideoAdapter } from "@/lib/types";
import { formatTime, computeMatchInfo } from "@/lib/matchTime";
import { MarcosState } from "@/lib/types";

type Props = {
  adapter: VideoAdapter;
  marcos: MarcosState;
};

export default function Transport({ adapter, marcos }: Props) {
  const { playing, currentTime, duration, seekTo, togglePlay } = adapter;
  const info = computeMatchInfo(currentTime, marcos);

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-lg border border-line bg-panel px-3 py-2">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#8FD14F] text-bg"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="flex-1"
        />
        <div className="whitespace-nowrap font-mono text-sm font-semibold">
          {formatTime(currentTime)} <span className="text-dim">/ {formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-[rgba(143,209,79,0.25)] bg-[rgba(143,209,79,0.08)] px-2.5 py-1.5 text-xs text-[#B7E894]">
        <Clock size={13} />
        <span>
          {info.label}
          {info.minute != null ? ` · ${info.minute}'` : ""}
        </span>
      </div>
    </>
  );
}
