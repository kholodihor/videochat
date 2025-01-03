import { Server } from "socket.io";

export function createSocketServer(httpServer) {
  const io = new Server(httpServer);
  let onlineUsers = [];

  io.on("connection", (socket) => {
    socket.on("new-user-joined", (clerkUser) => {
      if (clerkUser && !onlineUsers.some(user => user?.userId === clerkUser.id)) {
        onlineUsers.push({
          userId: clerkUser.id,
          socketId: socket.id,
          profile: clerkUser,
        });

        io.emit("online-users", onlineUsers);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
      io.emit("online-users", onlineUsers);
    });

    socket.on("call-user", (participants) => {
      if (participants.callee.socketId) {
        io.to(participants.callee.socketId).emit("call-user", { participants, isRinging: true });
      }
    });

    socket.on("wbrtc:signal", ({ sdp, ongoingCall, isCaller }) => {
      const targetUser = onlineUsers.find(u =>
        isCaller
          ? u.userId === ongoingCall.participants.callee.userId
          : u.userId === ongoingCall.participants.caller.userId,
      );

      if (targetUser) {
        io.to(targetUser.socketId).emit("wbrtc:signal", { sdp, ongoingCall, isCaller });
      }
    });

    socket.on("join-call", ({ callData, user }) => {
      const targetUser = onlineUsers.find(u =>
        u.userId === callData.participants.caller.userId
        || u.userId === callData.participants.callee.userId,
      );
      if (targetUser) {
        io.to(targetUser.socketId).emit("join-call", { callData, user });
      }
    });

    socket.on("call-rejected", (callData) => {
      const targetUser = onlineUsers.find(u =>
        u.userId === callData.participants.caller.userId,
      );
      if (targetUser) {
        io.to(targetUser.socketId).emit("call-rejected", callData);
      }
    });

    socket.on("call-ended", (callData) => {
      const participants = [
        callData.participants.caller.userId,
        callData.participants.callee.userId,
      ];

      onlineUsers.forEach((user) => {
        if (participants.includes(user.userId)) {
          io.to(user.socketId).emit("call-ended", callData);
        }
      });
    });
  });

  return io;
}
