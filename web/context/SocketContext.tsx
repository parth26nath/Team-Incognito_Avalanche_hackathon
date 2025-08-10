import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getSocket, disconnectSocket } from "../helpers/socketHelper";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socketInstance = getSocket();
    if (socketInstance) setSocket(socketInstance);

    return () => {
      disconnectSocket();
    };
  }, []);

  const connectSocket = () => {
    if (socket && !isConnected) {
      socket.connect();
      setIsConnected(true);

      socket.on("User-not-found", () => {
        console.log(
          "Couldnt place the call as the user could not be found among those online",
        );
      });
      /*
      socket.on("call-request", onCallRequest);
      socket.on("call-denied", onCallDenied);
      socket.on("call-accepted", onCallAccepted);
            */
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setIsConnected(false);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, connectSocket, disconnectSocket: handleDisconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType | null =>
  useContext(SocketContext);
