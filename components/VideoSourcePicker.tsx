"use client";

import { useState } from "react";
import { Youtube, Video } from "lucide-react";
import { extractYouTubeId } from "@/lib/matchTime";

type Props = {
  onChooseYouTube: (videoId: string) => void;
  onChooseLocal: (file: File) => void;
};

export default function VideoSourcePicker({ onChooseYouTube, onChooseLocal }: Props) {
  const [tab, setTab] = useState<"youtube" | "local">("youtube");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitYouTube = () => {
    const id = extractYouTubeId(url.trim());
    if (!id) {
      setError("Não consegui reconhecer esse link. Cole a URL completa do vídeo do YouTube.");
      return;
    }
    setError(null);
    onChooseYouTube(id);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("youtube")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
            tab === "youtube" ? "bg-[#8FD14F] text-bg" : "text-dim"
          }`}
        >
          <Youtube size={14} /> Link do YouTube
        </button>
        <button
          onClick={() => setTab("local")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
            tab === "local" ? "bg-[#8FD14F] text-bg" : "text-dim"
          }`}
        >
          <Video size={14} /> Arquivo local
        </button>
      </div>

      {tab === "youtube" ? (
        <div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitYouTube()}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-sm outline-none"
          />
          {error && <div className="mt-2 text-xs text-[#E05A5A]">{error}</div>}
          <p className="mt-2 text-xs text-dim">
            Use "não listado" se for um vídeo enviado pela sua própria conta — assim qualquer pessoa
            com o link consegue assistir, sem precisar de login.
          </p>
          <button
            onClick={submitYouTube}
            className="mt-3 rounded-md bg-[#8FD14F] px-4 py-2 text-xs font-bold text-bg"
          >
            Carregar vídeo
          </button>
        </div>
      ) : (
        <div
          className="cursor-pointer rounded-lg border border-dashed border-line px-6 py-8 text-center"
          onClick={() => document.getElementById("local-file-input")?.click()}
        >
          <Video size={26} className="mx-auto text-dim" />
          <div className="mt-2 text-sm font-semibold">Selecionar vídeo da partida</div>
          <div className="mt-1 text-xs text-dim">MP4, MOV ou WEBM · o arquivo não sai do seu computador</div>
          <input
            id="local-file-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChooseLocal(f);
            }}
          />
        </div>
      )}
    </div>
  );
}
