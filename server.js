import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./src/socket-events/onCall.js";
// import onWebrtcSignal from "./src/socket-events/onWebrtcSignal.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);
  let onlineUsers = [];

  io.on("connection", (socket) => {
    socket.on("new-user-joined", (clerkUser) => {
      if (clerkUser && !onlineUsers.some((user) => user?.userId === clerkUser.id)) {
        onlineUsers.push({
          userId: clerkUser.id,
          socketId: socket.id,
          profile: clerkUser
        });
        io.emit("online-users", onlineUsers);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
      io.emit("online-users", onlineUsers);
    });
    
    socket.on("call-user", (participants) => onCall(participants));

    socket.on("wbrtc:signal", ({ sdp, ongoingCall, isCaller }) => {
      const targetUser = onlineUsers.find(u => 
        isCaller ? u.userId === ongoingCall.participants.callee.userId 
                : u.userId === ongoingCall.participants.caller.userId
      );
      
      if (targetUser) {
        io.to(targetUser.socketId).emit("wbrtc:signal", { sdp, ongoingCall, isCaller });
      }
    });

    socket.on("join-call", ({ callData, user }) => {
      const targetUser = onlineUsers.find(u => 
        u.userId === callData.participants.caller.userId || 
        u.userId === callData.participants.callee.userId
      );
      if (targetUser) {
        io.to(targetUser.socketId).emit("join-call", { callData, user });
      }
    });

    socket.on("call-rejected", (callData) => {
      const targetUser = onlineUsers.find(u => 
        u.userId === callData.participants.caller.userId
      );
      if (targetUser) {
        io.to(targetUser.socketId).emit("call-rejected", callData);
      }
    });

    socket.on("call-ended", (callData) => {
      const participants = [
        callData.participants.caller.userId,
        callData.participants.callee.userId
      ];
      
      onlineUsers.forEach(user => {
        if (participants.includes(user.userId)) {
          io.to(user.socketId).emit("call-ended", callData);
        }
      });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});