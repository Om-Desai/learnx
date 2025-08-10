"use client";
import { useEffect, useRef } from "react";

export function VideoPlayer({ src, title }: { src: string; title?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    async function send(type: string, metadata?: unknown) {
      try {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, page: "video", element: title ?? src, metadata }),
          keepalive: true,
        });
      } catch {}
    }

    const onPlay = () => send("video_play");
    const onPause = () => send("video_pause", { currentTime: el.currentTime });
    const onEnded = () => send("video_complete");

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [src, title]);

  return (
    <div className="space-y-2">
      {title && <p className="text-sm text-gray-700">{title}</p>}
      <video ref={ref} src={src} controls className="w-full rounded border" />
    </div>
  );
}

