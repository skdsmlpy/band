"use client";
import { useEffect } from "react";
import { disconnectSocket, getSocket, initSocket } from "@/lib/socket";
import { useAppSelector } from "@/store";

export function SocketClient() {
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    initSocket(token ?? undefined);
    const s = getSocket();
    s?.on("connect", () => console.log("socket connected"));
    s?.on("disconnect", () => console.log("socket disconnected"));
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return null;
}
