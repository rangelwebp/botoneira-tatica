import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div>
        <div className="font-display text-2xl font-semibold">Botoneira Tática</div>
        <p className="mt-2 text-sm text-dim">Análise tática de partidas — via link do YouTube ou vídeo local</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/analisar"
          className="rounded-lg bg-[#8FD14F] px-5 py-2.5 text-sm font-bold text-bg"
        >
          Nova Análise
        </Link>
        <Link
          href="/ver"
          className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-semibold"
        >
          Importar Análise
        </Link>
      </div>
    </main>
  );
}
