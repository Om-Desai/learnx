"use client";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export function EventTracker({ page }: { page: string }) {
  const sessionIdRef = useRef<string | null>(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current = typeof window !== "undefined" ? localStorage.getItem("lx_session") : null;
    if (!sessionIdRef.current && typeof window !== "undefined") {
      const id = uuidv4();
      localStorage.setItem("lx_session", id);
      sessionIdRef.current = id;
    }
  }

  useEffect(() => {
    async function send(type: string, data: Record<string, unknown> = {}) {
      try {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, page, sessionId: sessionIdRef.current!, ...data }),
          keepalive: true,
        });
      } catch {}
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const element = target?.closest("button,a,input,video") as HTMLElement | null;
      const tag = element?.tagName?.toLowerCase();
      const descriptor = tag ? `${tag}${element?.id ? `#${element.id}` : ""}` : undefined;
      send("click", { element: descriptor });
    };

    const handleVisibility = () => {
      send(document.visibilityState === "visible" ? "page_visible" : "page_hidden");
    };

    send("page_view");
    window.addEventListener("click", handleClick);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [page]);

  return null;
}

