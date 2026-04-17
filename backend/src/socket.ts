import { Server } from "socket.io";
import http from "http";
import { prisma } from "./db/prisma.ts";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Join a personal room to receive private messages (e.g., room ID is their User ID)
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId}`);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, receiverId, content } = data;

      try {
        // Save the message to DB
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        });

        // Emit back to the conversation or directly to the receiver's room
        io.to(receiverId).emit("receiveMessage", message);
        io.to(senderId).emit("receiveMessage", message); 
      } catch (error) {
        console.error("Socket send message error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
