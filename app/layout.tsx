import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Botoneira Tática",
  description: "Análise tática de partidas de futebol — YouTube ou vídeo local",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
