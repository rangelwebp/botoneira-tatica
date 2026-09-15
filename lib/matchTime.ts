import { MarcosState } from "./types";

export function formatTime(sec: number | null | undefined): string {
  if (sec == null || isNaN(sec)) return "--:--";
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${m}:${pad(ss)}`;
}

/**
 * Converte um timestamp "bruto" do vídeo/YouTube no minuto real de jogo,
 * usando os marcos que o analista marcou (início 1ºT, intervalo, início 2ºT).
 * Essencial pro caso de lives de 3-4h no YouTube, onde o "tempo do vídeo"
 * não tem relação nenhuma com o "tempo de jogo".
 */
export function computeMatchInfo(
  time: number,
  marcos: MarcosState
): { label: string; minute: number | null } {
  if (marcos.k1 == null || time < marcos.k1) return { label: "Pré-jogo", minute: null };

  if (marcos.ht != null && time >= marcos.ht && (marcos.k2 == null || time < marcos.k2)) {
    return { label: "Intervalo", minute: null };
  }

  if (marcos.k2 != null && time >= marcos.k2) {
    return { label: "2ºT", minute: Math.floor((time - marcos.k2) / 60) + 46 };
  }

  return { label: "1ºT", minute: Math.floor((time - marcos.k1) / 60) + 1 };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Extrai o ID do vídeo de qualquer formato comum de URL do YouTube. */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
