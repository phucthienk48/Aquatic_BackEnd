const CommentLive = require("../models/CommentLivestream.model");
const Livestream = require("../models/Livestream.model");
const AutoOrderService = require("../services/autoOrder.service");

module.exports = (io) => {

  // lưu số người xem
  const viewerCounts = {};

  io.on("connection", (socket) => {

    console.log("user connected:", socket.id);

    // user tham gia phòng livestream
    socket.on("joinRoom", (livestreamId) => {

      socket.join(livestreamId);
      socket.roomId = livestreamId;

      if (!viewerCounts[livestreamId]) {
        viewerCounts[livestreamId] = 0;
      }

      viewerCounts[livestreamId]++;

      io.to(livestreamId).emit(
        "viewerCount",
        viewerCounts[livestreamId]
      );

    });

    // user rời phòng livestream
    socket.on("leaveRoom", (livestreamId) => {

      socket.leave(livestreamId);

      if (viewerCounts[livestreamId] && viewerCounts[livestreamId] > 0) {
        viewerCounts[livestreamId]--;
      }

      io.to(livestreamId).emit(
        "viewerCount",
        viewerCounts[livestreamId]
      );

    });

    // admin bắt đầu livestream
    socket.on("startLivestream", async (livestreamId) => {

      try {

        await Livestream.findByIdAndUpdate(livestreamId, {
          status: "live",
          startedAt: new Date(),
        });

        io.to(livestreamId).emit("livestreamStarted", {
          livestreamId,
        });

        console.log("livestream started:", livestreamId);

      } catch (err) {
        console.error("start livestream error:", err);
      }

    });

    // nhận video từ admin và phát cho viewer
    socket.on("streamVideo", ({ livestreamId, chunk }) => {

      const buffer = Buffer.from(chunk);

      io.to(livestreamId).emit("receiveVideo", buffer);

    });

    // admin kết thúc livestream
    socket.on("endLivestream", async (livestreamId) => {

      try {

        await Livestream.findByIdAndUpdate(livestreamId, {
          status: "ended",
          endedAt: new Date(),
        });

        io.to(livestreamId).emit("livestreamEnded", {
          livestreamId,
        });

      } catch (err) {
        console.error("end livestream error:", err);
      }

    });

    // gửi comment và xử lý chốt đơn
    socket.on("sendComment", async (data) => {

      try {

        const { livestreamId, userId, content } = data;

        const comment = await CommentLive.create({
          livestreamId,
          user: userId,
          content,
        });

        const populatedComment = await comment.populate(
          "user",
          "username avatar"
        );

        io.to(livestreamId).emit(
          "newComment",
          populatedComment
        );

        const order = await AutoOrderService.handle({
          livestreamId,
          userId,
          content,
        });

        if (order) {

          socket.emit("autoOrderSuccess", {
            message: "chốt đơn thành công",
            orderId: order._id,
            totalPrice: order.totalPrice,
          });

        }

      } catch (err) {
        console.error("comment error:", err);
      }

    });

    // cập nhật sản phẩm livestream
    socket.on("updateLiveProduct", (data) => {

      const { livestreamId } = data;

      io.to(livestreamId).emit(
        "updateLiveProducts",
        data
      );

    });

    // khi user disconnect
    socket.on("disconnect", () => {

      const livestreamId = socket.roomId;

      if (livestreamId && viewerCounts[livestreamId] && viewerCounts[livestreamId] > 0) {

        viewerCounts[livestreamId]--;

        io.to(livestreamId).emit(
          "viewerCount",
          viewerCounts[livestreamId]
        );

      }

      console.log("user disconnected:", socket.id);

    });

  });
};