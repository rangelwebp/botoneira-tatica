"use client";

import { useEffect, useRef, useState } from "react";
import { VideoAdapter } from "./types";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

/** Garante que o script da API do YouTube só é carregado uma vez, mesmo se
 *  vários players forem montados na mesma sessão. */
function loadYouTubeApi(): Promise<void> {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Adaptador do player do YouTube. Expõe exatamente a mesma "forma"
 * (VideoAdapter) que o hook de vídeo local — a botoneira nunca precisa
 * saber qual dos dois está por trás.
 */
export function useYouTubePlayer(videoId: string | null, containerId: string): VideoAdapter {
  const playerRef = useRef<any>(null);
  const pollRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled) return;
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            setReady(true);
            setDuration(e.target.getDuration());
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      pollRef.current && window.clearInterval(pollRef.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, containerId]);

  // A API do YouTube não emite um evento "timeupdate" contínuo como o
  // <video> nativo — por isso fazemos polling leve enquanto toca.
  useEffect(() => {
    if (!ready) return;
    pollRef.current = window.setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 200);
    return () => {
      pollRef.current && window.clearInterval(pollRef.current);
    };
  }, [ready]);

  const seekTo = (seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  return { ready, playing, currentTime, duration, seekTo, togglePlay };
}
