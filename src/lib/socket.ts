"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function initSocket(token?: string) {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) return;
  socket = io(url, {
    transports: ["websocket"],
    auth: token ? { token } : undefined,
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
