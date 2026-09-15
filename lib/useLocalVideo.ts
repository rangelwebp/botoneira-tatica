"use client";

import { RefObject, useCallback, useEffect, useState } from "react";
import { VideoAdapter } from "./types";

/**
 * Adaptador de vídeo local. O arquivo nunca sai do navegador: usamos
 * URL.createObjectURL pra criar uma referência local que o <video> nativo
 * consegue tocar, sem upload nenhum.
 */
export function useLocalVideo(videoRef: RefObject<HTMLVideoElement>, fileUrl: string | null): VideoAdapter {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
  }, [fileUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onLoaded = () => {
      setDuration(v.duration || 0);
      setReady(true);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef, fileUrl]);

  const seekTo = useCallback(
    (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        setCurrentTime(seconds);
      }
    },
    [videoRef]
  );

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }, [videoRef]);

  return { ready, playing, currentTime, duration, seekTo, togglePlay };
}
