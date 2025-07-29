const { Server } = require("socket.io");

let activeUsers = [];

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    socket.on("join-room", ({ roomId, userId, role }) => {
      const joinTime = Date.now();

      console.log(`👤 User ${userId} (${role}) joined room ${roomId}`);
      socket.join(roomId);

      // Track user info
      const userData = {
        socketId: socket.id,
        userId,
        role,
        roomId,
        joinTime
      };
      activeUsers.push(userData);

      // Notify other users in the room
      socket.to(roomId).emit("user-connected", userId);

      // WebRTC signaling
      socket.on("signal", (data) => {
        socket.to(roomId).emit("signal", {
          userId: data.userId,
          signalData: data.signalData
        });
      });

      // 🔁 Book page synchronization
      socket.on("sync-page", ({ roomId, pageNumber }) => {
        console.log(`📄 Syncing page ${pageNumber} in room ${roomId}`);
        socket.to(roomId).emit("sync-page", { pageNumber });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        const leaveTime = Date.now();
        const index = activeUsers.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
          const user = activeUsers[index];
          user.duration = Math.floor((leaveTime - user.joinTime) / 1000);
          console.log(`❌ User ${user.userId} disconnected after ${user.duration} seconds`);
          activeUsers.splice(index, 1);
        }
        socket.to(userData.roomId).emit("user-disconnected", userData.userId);
      });
    });

    // Admin API: Get current connected users
    socket.on("get-active-users", () => {
      const enrichedUsers = activeUsers.map(u => ({
        ...u,
        duration: Math.floor((Date.now() - u.joinTime) / 1000)
      }));
      socket.emit("active-users", enrichedUsers);
    });

    // 🔥 Admin disconnect specific user
    socket.on("admin-disconnect-user", (targetUserId) => {
      const target = activeUsers.find(u => u.userId === targetUserId);
      if (target) {
        const targetSocket = io.sockets.sockets.get(target.socketId);
        if (targetSocket) {
          console.log(`⚠️ Admin forcibly disconnecting user ${target.userId}`);
          targetSocket.disconnect(true);
        }
      }
    });
  });
}

module.exports = setupSocket;
