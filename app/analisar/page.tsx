"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import botoneiraConfig from "@/data/botonera.json";
import { EventoRecorte, MarcosState, Marco, VideoSourceType, PartidaInfo, PARTIDA_VAZIA } from "@/lib/types";
import { computeMatchInfo, uid } from "@/lib/matchTime";
import { tituloPartida, subtituloPartida, nomeArquivo } from "@/lib/partida";
import { useYouTubePlayer } from "@/lib/useYouTubePlayer";
import { useLocalVideo } from "@/lib/useLocalVideo";
import VideoSourcePicker from "@/components/VideoSourcePicker";
import PlayerBox from "@/components/PlayerBox";
import Transport from "@/components/Transport";
import MarcosRow from "@/components/MarcosRow";
import Botonera from "@/components/Botonera";
import Timeline from "@/components/Timeline";
import FichaPartida from "@/components/FichaPartida";

const YT_CONTAINER_ID = "yt-player-container";

export default function AnalisarPage() {
  const [source, setSource] = useState<VideoSourceType | null>(null);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [videoNome, setVideoNome] = useState<string>("");

  const [partida, setPartida] = useState<PartidaInfo>(PARTIDA_VAZIA);
  const [fichaAberta, setFichaAberta] = useState(false);
  const [marcos, setMarcos] = useState<MarcosState>({ k1: null, ht: null, k2: null, end: null });
  const [events, setEvents] = useState<EventoRecorte[]>([]);
  const [flashKey, setFlashKey] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Os dois adaptadores sempre existem — só um está "ativo" por vez,
  // dependendo da fonte escolhida. É isso que permite trocar de fonte sem
  // duplicar nenhuma lógica de botoneira/timeline/export.
  const youtubeAdapter = useYouTubePlayer(source === "youtube" ? youtubeId : null, YT_CONTAINER_ID);
  const localAdapter = useLocalVideo(localVideoRef, source === "local" ? localFileUrl : null);
  const adapter = source === "youtube" ? youtubeAdapter : localAdapter;

  const flash = (key: string) => {
    setFlashKey(key);
    setTimeout(() => setFlashKey((cur) => (cur === key ? null : cur)), 260);
  };

  const onMark = (marco: Marco) => {
    const t = adapter.currentTime;
    setMarcos((m) => ({ ...m, [marco.id]: t }));
    flash("marco-" + marco.id);
    setEvents((ev) => [...ev, { id: uid(), grupo: "Marco", acao: marco.label, tempo: t, criadoEm: Date.now() }]);
  };

  const onAction = (grupo: string, acao: string) => {
    const t = adapter.currentTime;
    const info = computeMatchInfo(t, marcos);
    flash(grupo + "|" + acao);
    setEvents((ev) => [
      ...ev,
      { id: uid(), grupo, acao, tempo: t, meiaFinal: info.label, minuto: info.minute, criadoEm: Date.now() },
    ]);
  };

  const onRemove = (id: string) => setEvents((ev) => ev.filter((e) => e.id !== id));

  const contagem = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of events) c[e.grupo + "|" + e.acao] = (c[e.grupo + "|" + e.acao] || 0) + 1;
    return c;
  }, [events]);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.tempo - b.tempo), [events]);

  const exportarJSON = () => {
    const payload = {
      versao: 1,
      partida,
      fonte: source,
      youtubeId: youtubeId ?? null,
      videoNome: videoNome || null,
      marcos,
      eventos: events,
      exportadoEm: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeArquivo(partida)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-5 py-3.5">
        <Link href="/" className="font-display text-base font-semibold">
          Botoneira Tática
        </Link>
        <nav className="flex gap-1.5 rounded-lg border border-line bg-panel p-1">
          <span className="rounded-md bg-[#8FD14F] px-3.5 py-1.5 text-xs font-semibold text-bg">Nova Análise</span>
          <Link href="/ver" className="rounded-md px-3.5 py-1.5 text-xs font-semibold text-dim">
            Importar Análise
          </Link>
        </nav>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1.15fr_1fr]">
        <section className="flex min-w-0 flex-col gap-3">
          <button
            onClick={() => setFichaAberta(true)}
            className="flex items-center justify-between gap-2 rounded-md border border-line bg-panel px-3 py-2 text-left"
          >
            <span className="min-w-0 truncate">
              <span className="block truncate font-display text-sm font-medium">{tituloPartida(partida)}</span>
              {subtituloPartida(partida) && (
                <span className="block truncate text-xs text-dim">{subtituloPartida(partida)}</span>
              )}
            </span>
            <span className="flex flex-shrink-0 items-center gap-1.5 rounded bg-panel2 px-2 py-1 text-xs font-semibold text-dim">
              <ClipboardList size={13} /> Ficha da partida
            </span>
          </button>

          {!source ? (
            <VideoSourcePicker
              onChooseYouTube={(id) => {
                setSource("youtube");
                setYoutubeId(id);
                setVideoNome(`youtube.com/watch?v=${id}`);
              }}
              onChooseLocal={(file) => {
                setSource("local");
                setLocalFileUrl(URL.createObjectURL(file));
                setVideoNome(file.name);
              }}
            />
          ) : (
            <>
              <PlayerBox
                source={source}
                youtubeContainerId={YT_CONTAINER_ID}
                localVideoRef={localVideoRef}
                localFileUrl={localFileUrl}
              />
              <Transport adapter={adapter} marcos={marcos} />
            </>
          )}

          <MarcosRow
            marcos={botoneiraConfig.marcos}
            values={marcos}
            disabled={!source || !adapter.ready}
            flashId={flashKey}
            onMark={onMark}
          />

          <Timeline events={sortedEvents} onSeek={adapter.seekTo} onRemove={onRemove} onExport={exportarJSON} />
        </section>

        <section className="min-w-0">
          <Botonera
            config={botoneiraConfig}
            contagem={contagem}
            flashKey={flashKey}
            disabled={!source || !adapter.ready}
            onAction={onAction}
          />
        </section>
      </main>

      <FichaPartida open={fichaAberta} onClose={() => setFichaAberta(false)} value={partida} onChange={setPartida} />
    </div>
  );
}
