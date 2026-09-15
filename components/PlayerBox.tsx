"use client";

import { RefObject } from "react";
import { VideoSourceType } from "@/lib/types";

type Props = {
  source: VideoSourceType;
  youtubeContainerId: string;
  localVideoRef: RefObject<HTMLVideoElement>;
  localFileUrl: string | null;
};

/**
 * Caixa visual do player. Pra YouTube, é só uma div vazia com um id — o
 * useYouTubePlayer injeta o iframe ali dentro. Pra vídeo local, é o
 * elemento <video> nativo. A moldura e o aspect ratio são os mesmos nos
 * dois casos, então visualmente não dá pra perceber diferença.
 */
export default function PlayerBox({ source, youtubeContainerId, localVideoRef, localFileUrl }: Props) {
  return (
    <div className="aspect-video overflow-hidden rounded-lg bg-black">
      {source === "youtube" ? (
        <div id={youtubeContainerId} className="h-full w-full" />
      ) : (
        <video ref={localVideoRef} src={localFileUrl ?? undefined} className="h-full w-full" />
      )}
    </div>
  );
}
