"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileJson, Upload, Video } from "lucide-react";
import { AnaliseExport, MarcosState } from "@/lib/types";
import { formatTime } from "@/lib/matchTime";
import { tituloPartida, subtituloPartida } from "@/lib/partida";
import { useYouTubePlayer } from "@/lib/useYouTubePlayer";
import { useLocalVideo } from "@/lib/useLocalVideo";
import PlayerBox from "@/components/PlayerBox";
import Timeline from "@/components/Timeline";

const YT_CONTAINER_ID = "yt-player-container-ver";

export default function VerPage() {
  const [data, setData] = useState<AnaliseExport | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const source = data?.fonte ?? null;
  const youtubeAdapter = useYouTubePlayer(source === "youtube" ? data?.youtubeId ?? null : null, YT_CONTAINER_ID);
  const localAdapter = useLocalVideo(localVideoRef, source === "local" ? localFileUrl : null);
  const adapter = source === "youtube" ? youtubeAdapter : localAdapter;

  const hasPlayableVideo = source === "youtube" || (source === "local" && localFileUrl);

  const importarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as AnaliseExport;
        setData(parsed);
      } catch {
        alert("Não consegui ler esse arquivo. Confirme se é um .json exportado por esta ferramenta.");
      }
    };
    reader.readAsText(f);
  };

  const sortedEvents = useMemo(
    () => (data ? [...data.eventos].sort((a, b) => a.tempo - b.tempo) : []),
    [data]
  );

  const porGrupo = useMemo(() => {
    const g: Record<string, typeof sortedEvents> = {};
    for (const e of sortedEvents) {
      if (!g[e.grupo]) g[e.grupo] = [];
      g[e.grupo].push(e);
    }
    return g;
  }, [sortedEvents]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-5 py-3.5">
        <Link href="/" className="font-display text-base font-semibold">
          Botoneira Tática
        </Link>
        <nav className="flex gap-1.5 rounded-lg border border-line bg-panel p-1">
          <Link href="/analisar" className="rounded-md px-3.5 py-1.5 text-xs font-semibold text-dim">
            Nova Análise
          </Link>
          <span className="rounded-md bg-[#8FD14F] px-3.5 py-1.5 text-xs font-semibold text-bg">
            Importar Análise
          </span>
        </nav>
      </header>

      {!data ? (
        <main className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
          <FileJson size={30} className="text-dim" />
          <div className="text-sm font-semibold">Importar arquivo da análise</div>
          <div className="max-w-xs text-xs text-dim">Selecione o .json exportado pelo analista pra ver o dashboard</div>
          <button
            onClick={() => importRef.current?.click()}
            className="mt-2 flex items-center gap-2 rounded-md bg-[#8FD14F] px-4 py-2.5 text-xs font-bold text-bg"
          >
            <Upload size={15} /> Selecionar arquivo .json
          </button>
          <input ref={importRef} type="file" accept="application/json" onChange={importarJSON} className="hidden" />
        </main>
      ) : (
        <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1.3fr_0.8fr]">
          <section className="flex min-w-0 flex-col gap-3">
            <div className="rounded-md border border-line bg-panel px-3 py-2.5">
              <div className="font-display text-sm font-medium">{tituloPartida(data.partida)}</div>
              {subtituloPartida(data.partida) && (
                <div className="mt-1 text-xs text-dim">{subtituloPartida(data.partida)}</div>
              )}
              {data.partida.contexto && (
                <div className="mt-1.5 text-xs text-dim">{data.partida.contexto}</div>
              )}
            </div>

            {source === "youtube" ? (
              <PlayerBox
                source="youtube"
                youtubeContainerId={YT_CONTAINER_ID}
                localVideoRef={localVideoRef}
                localFileUrl={null}
              />
            ) : localFileUrl ? (
              <PlayerBox
                source="local"
                youtubeContainerId={YT_CONTAINER_ID}
                localVideoRef={localVideoRef}
                localFileUrl={localFileUrl}
              />
            ) : (
              <div
                className="cursor-pointer rounded-lg border border-dashed border-line bg-panel px-6 py-8 text-center"
                onClick={() => document.getElementById("ver-local-input")?.click()}
              >
                <Video size={26} className="mx-auto text-dim" />
                <div className="mt-2 text-sm font-semibold">Selecionar vídeo correspondente</div>
                <div className="mt-1 text-xs text-dim">
                  {data.videoNome ? `arquivo original: ${data.videoNome}` : "opcional — sem vídeo você ainda vê a timeline e as estatísticas"}
                </div>
                <input
                  id="ver-local-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setLocalFileUrl(URL.createObjectURL(f));
                  }}
                />
              </div>
            )}

            <Timeline
              events={sortedEvents}
              onSeek={(t) => hasPlayableVideo && adapter.seekTo(t)}
              readOnly
            />
          </section>

          <section className="min-w-0">
            <div className="mb-2.5 font-display text-xs font-semibold uppercase tracking-wide text-dim">
              Resumo por categoria
            </div>
            {Object.entries(porGrupo).map(([grupo, list]) => {
              const porAcao: Record<string, number> = {};
              for (const e of list) porAcao[e.acao] = (porAcao[e.acao] || 0) + 1;
              return (
                <div key={grupo} className="mb-2.5 overflow-hidden rounded-lg border border-line bg-panel">
                  <div className="flex justify-between bg-panel2 px-3 py-2 text-xs font-semibold">
                    <span>{grupo}</span>
                    <span className="font-mono text-[#8FD14F]">{list.length}</span>
                  </div>
                  {Object.entries(porAcao).map(([acao, n]) => (
                    <div key={acao} className="flex justify-between border-t border-line px-3 py-1.5 text-xs">
                      <span>{acao}</span>
                      <span className="font-mono text-dim">{n}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>
        </main>
      )}
    </div>
  );
}
