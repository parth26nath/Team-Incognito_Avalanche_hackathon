import { Server as SocketServer } from "socket.io";
import ExtendedSocket from "./interfaces/ExtendedSocket";
import { v4 as uuidv4 } from "uuid";
import { setUserOnline, setUserOffline } from "./services/UserService";

interface ChatRoom {
  id: string;
  participants: string[];
}

export default function socketSetup(io: SocketServer) {
  const onlineUsers: Record<string, string> = {};
  const waitingUsers: string[] = [];
  const activeChats: Record<string, ChatRoom> = {};

  io.on("connection", async (socket: ExtendedSocket) => {
    if (!socket.user?.walletAddress) {
      console.log("Unauthenticated connection attempt");
      socket.disconnect();
      return;
    }

    const walletAddress = socket.user.walletAddress.toLowerCase();
    onlineUsers[walletAddress] = socket.id;
    await setUserOnline(walletAddress);
    console.log(`User connected: ${walletAddress}`);

    // Handle random chat matching
    socket.on("find-random-chat", () => {
      const userId = socket.user?.walletAddress?.toLowerCase();
      if (!userId) return;

      // Remove user from any existing chat
      Object.entries(activeChats).forEach(([roomId, room]) => {
        if (room.participants.includes(userId)) {
          delete activeChats[roomId];
          room.participants.forEach(participant => {
            const participantSocket = onlineUsers[participant];
            if (participantSocket) {
              io.to(participantSocket).emit("chat-ended");
            }
          });
        }
      });

      // If someone is waiting, create a chat room
      if (waitingUsers.length > 0 && !waitingUsers.includes(userId)) {
        const partnerId = waitingUsers.shift()!;
        const roomId = uuidv4();
        
        activeChats[roomId] = {
          id: roomId,
          participants: [userId, partnerId]
        };

        // Notify both users
        socket.emit("partner-found", partnerId);
        const partnerSocket = onlineUsers[partnerId];
        if (partnerSocket) {
          io.to(partnerSocket).emit("partner-found", userId);
        }
      } else if (!waitingUsers.includes(userId)) {
        // Add user to waiting list
        waitingUsers.push(userId);
      }
    });

    // Handle chat messages
    socket.on("send-message", (message) => {
      const userId = socket.user?.walletAddress?.toLowerCase();
      if (!userId) return;

      // Find the chat room this user is in
      const room = Object.values(activeChats).find(room => 
        room.participants.includes(userId)
      );

      if (room) {
        const recipient = room.participants.find(p => p !== userId);
        if (recipient) {
          const recipientSocket = onlineUsers[recipient];
          if (recipientSocket) {
            io.to(recipientSocket).emit("chat-message", message);
          }
        }
      }
    });

    // Handle typing indicators
    socket.on("typing", () => {
      const userId = socket.user?.walletAddress?.toLowerCase();
      if (!userId) return;

      const room = Object.values(activeChats).find(room => 
        room.participants.includes(userId)
      );

      if (room) {
        const recipient = room.participants.find(p => p !== userId);
        if (recipient) {
          const recipientSocket = onlineUsers[recipient];
          if (recipientSocket) {
            io.to(recipientSocket).emit("partner-typing");
          }
        }
      }
    });

    // Handle chat ending
    socket.on("end-chat", () => {
      const userId = socket.user?.walletAddress?.toLowerCase();
      if (!userId) return;

      Object.entries(activeChats).forEach(([roomId, room]) => {
        if (room.participants.includes(userId)) {
          delete activeChats[roomId];
          room.participants.forEach(participant => {
            if (participant !== userId) {
              const participantSocket = onlineUsers[participant];
              if (participantSocket) {
                io.to(participantSocket).emit("chat-ended");
              }
            }
          });
        }
      });
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      if (socket.user?.walletAddress) {
        const walletAddress = socket.user.walletAddress.toLowerCase();
        
        // Remove from waiting list if present
        const waitingIndex = waitingUsers.indexOf(walletAddress);
        if (waitingIndex !== -1) {
          waitingUsers.splice(waitingIndex, 1);
        }

        // End any active chats
        Object.entries(activeChats).forEach(([roomId, room]) => {
          if (room.participants.includes(walletAddress)) {
            delete activeChats[roomId];
            room.participants.forEach(participant => {
              if (participant !== walletAddress) {
                const participantSocket = onlineUsers[participant];
                if (participantSocket) {
                  io.to(participantSocket).emit("chat-ended");
                }
              }
            });
          }
        });

        delete onlineUsers[walletAddress];
        await setUserOffline(walletAddress);
        console.log("User disconnected:", walletAddress);
      }
    });
  });

  return {
    isUserOnline: (walletAddress: string) =>
      walletAddress.toLowerCase() in onlineUsers,
    getOnlineUsers: () => ({ ...onlineUsers }),
    getActiveChats: () => ({ ...activeChats }),
  };
}