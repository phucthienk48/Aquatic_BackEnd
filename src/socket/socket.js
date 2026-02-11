const CommentLive = require("../models/CommentLivestream.model");
const Livestream = require("../models/Livestream.model");
const Cart = require("../models/Cart.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    /* JOIN LIVESTREAM ROOM*/
    socket.on("joinRoom", (livestreamId) => {
      socket.join(livestreamId);
      console.log(`👤 ${socket.id} joined room ${livestreamId}`);
    });

    /* start and ended livestream */
    socket.on("startLivestream", async (livestreamId) => {
      await Livestream.findByIdAndUpdate(livestreamId, {
        status: "live",
        startedAt: new Date(),
      });

      io.to(livestreamId).emit("livestreamStarted", {
        livestreamId,
        status: "live",
      });
    });

    socket.on("endLivestream", async (livestreamId) => {
      await Livestream.findByIdAndUpdate(livestreamId, {
        status: "ended",
        endedAt: new Date(),
      });

      io.to(livestreamId).emit("livestreamEnded", {
        livestreamId,
        status: "ended",
      });
    });

    
    /* SEND COMMENT  */
    socket.on("sendComment", async (data) => {
      try {
        const { livestreamId, userId, content } = data;

        // Lưu DB
        const comment = await CommentLive.create({
          livestreamId,
          user: userId,
          content,
        });

        // Populate user (nếu cần)
        const populatedComment = await comment.populate(
          "user",
          "name avatar"
        );

        // Phát realtime cho cả room
        io.to(livestreamId).emit(
          "newComment",
          populatedComment
        );
      } catch (err) {
        console.error(" Comment error:", err.message);
      }
    });

    /* product livestream */
    socket.on("updateLiveProduct", (data) => {
      const { livestreamId, action, productId } = data;

      io.to(livestreamId).emit("updateLiveProducts", {
        livestreamId,
        action,
        productId,
      });
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });
};
