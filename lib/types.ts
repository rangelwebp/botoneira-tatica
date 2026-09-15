export type Marco = { id: string; label: string };
export type Grupo = { nome: string; tom: string; acoes: string[] };
export type BotoneraConfig = { marcos: Marco[]; grupos: Grupo[] };

export type MarcosState = {
  k1: number | null;
  ht: number | null;
  k2: number | null;
  end: number | null;
};

export type EventoRecorte = {
  id: string;
  grupo: string;
  acao: string;
  tempo: number; // segundos, no tempo do vídeo/YouTube
  meiaFinal?: string; // "1ºT" | "2ºT" | "Intervalo" | "Pré-jogo"
  minuto?: number | null; // minuto real de jogo, já com offset dos marcos
  criadoEm: number;
};

export type VideoSourceType = "youtube" | "local";

export type PartidaInfo = {
  partida: string; // texto livre, ex: "Time M x Time R"
  data: string; // formato yyyy-mm-dd, vem de um <input type="date">
  timeFoco: string; // time a analisar (o alvo do scouting)
  treinador: string; // treinador em foco — pode ser de qualquer um dos dois times
  motivo: string; // por que essa partida entrou na fila de análise
  contexto: string; // observações mais longas sobre o jogo
};

export const PARTIDA_VAZIA: PartidaInfo = {
  partida: "",
  data: "",
  timeFoco: "",
  treinador: "",
  motivo: "",
  contexto: "",
};

export type AnaliseExport = {
  versao: number;
  partida: PartidaInfo;
  fonte: VideoSourceType;
  youtubeId?: string | null;
  videoNome?: string | null;
  marcos: MarcosState;
  eventos: EventoRecorte[];
  exportadoEm: string;
};

// Interface comum que tanto o player do YouTube quanto o <video> local
// implementam. A botoneira e a timeline só falam com isso — nunca sabem
// se por trás tem YouTube ou um arquivo local.
export type VideoAdapter = {
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  seekTo: (seconds: number) => void;
  togglePlay: () => void;
};
