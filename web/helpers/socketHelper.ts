import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");

  if (!token) return null;

  if (!socket) {
    socket = io("https://heartly.live/socket", {
      path: "/socket/",
      autoConnect: false,
      auth: { token },
    });

    socket.on("auth_error", (error: string) => {
      if (error === "authentication failed") {
        alert("Session expired. Please log in again");
        //localStorage.removeItem("token");
        //window.location.reload();
      }
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
