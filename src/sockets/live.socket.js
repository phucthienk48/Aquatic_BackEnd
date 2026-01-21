const Product = require("../models/Product.model");

const viewers = {};
const liveStatus = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    /* ================= JOIN LIVE ================= */
    socket.on("join-live", (roomId) => {
      socket.join(roomId);

      viewers[roomId] = (viewers[roomId] || 0) + 1;
      io.to(roomId).emit("viewer-count", viewers[roomId]);
      socket.emit("live-status", !!liveStatus[roomId]);

      socket.on("disconnect", () => {
        viewers[roomId] = Math.max((viewers[roomId] || 1) - 1, 0);
        io.to(roomId).emit("viewer-count", viewers[roomId]);
        console.log("❌ Disconnected:", socket.id);
      });
    });

    /* ================= LIVE STATUS ================= */
    socket.on("start-live", (roomId) => {
      liveStatus[roomId] = true;
      io.to(roomId).emit("live-status", true);
    });

    socket.on("stop-live", (roomId) => {
      liveStatus[roomId] = false;
      io.to(roomId).emit("live-status", false);
    });

    /* ================= CLIENT READY ================= */
    socket.on("client-ready", ({ roomId }) => {
      socket.to(roomId).emit("client-ready", socket.id);
    });

    /* ================= WEBRTC SIGNAL ================= */
    socket.on("webrtc-offer", ({ to, offer }) => {
      io.to(to).emit("webrtc-offer", offer);
    });

    socket.on("webrtc-answer", ({ to, answer }) => {
      io.to(to).emit("webrtc-answer", answer);
    });

    socket.on("webrtc-ice", ({ to, candidate }) => {
      io.to(to).emit("webrtc-ice", candidate);
    });

    /* ================= PRODUCT LIVE ================= */
    socket.on("add-product", async ({ roomId, productId }) => {
      const product = await Product.findById(productId);
      if (product) io.to(roomId).emit("live-product-added", product);
    });

    /* ================= CHAT ================= */
    socket.on("send-message", ({ roomId, user, message }) => {
      io.to(roomId).emit("new-message", {
        user,
        message,
        time: new Date(),
      });
    });
  });
};
