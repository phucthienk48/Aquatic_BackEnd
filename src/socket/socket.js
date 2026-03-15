const CommentLive = require("../models/CommentLivestream.model");
const Livestream = require("../models/Livestream.model");
const AutoOrderService = require("../services/autoOrder.service");

const livestreamCameraService = require("../services/LivestreamCamera.service");

module.exports = (io) => {

  const viewerCounts = {};

  io.on("connection", (socket) => {

    console.log("user connected:", socket.id);

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

      const chunks = livestreamCameraService.getChunks(livestreamId);

      if (!chunks || chunks.length === 0) return;

      // chỉ lấy 3 chunk mới nhất để sync realtime
      const latestChunks = chunks.slice(-3);

      // delay để MediaSource phía client ready
      setTimeout(() => {

        latestChunks.forEach((chunk, index) => {

          setTimeout(() => {

            socket.emit("receiveVideo", chunk);

          }, index * 50);

        });

      }, 400);

    });


    // =========================
    // LEAVE ROOM
    // =========================
    socket.on("leaveRoom", (livestreamId) => {

      socket.leave(livestreamId);

      if (
        viewerCounts[livestreamId] &&
        viewerCounts[livestreamId] > 0
      ) {
        viewerCounts[livestreamId]--;
      }

      io.to(livestreamId).emit(
        "viewerCount",
        viewerCounts[livestreamId] || 0
      );

    });



    // =========================
    // START LIVESTREAM
    // =========================
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



    // =========================
    // STREAM VIDEO
    // =========================
    socket.on("streamVideo", ({ livestreamId, chunk }) => {

      const buffer = Buffer.from(chunk);

      livestreamCameraService.saveChunk(
        livestreamId,
        buffer
      );

      io.to(livestreamId).emit(
        "receiveVideo",
        buffer
      );

    });



    // =========================
    // END LIVESTREAM
    // =========================
    socket.on("endLivestream", async (data) => {

      try {

        const livestreamId = data.livestreamId || data;

        // cập nhật trạng thái livestream
        await Livestream.findByIdAndUpdate(
          livestreamId,
          {
            status: "ended",
            endedAt: new Date()
          }
        );

        // tắt camera
        await livestreamCameraService.stopCamera(
          livestreamId
        );

        // xoá toàn bộ chunk video
        livestreamCameraService.deleteChunks(
          livestreamId
        );

        // gửi sự kiện cho viewer
        io.to(livestreamId).emit(
          "livestreamEnded",
          { livestreamId }
        );

        console.log("livestream ended:", livestreamId);

      } catch (err) {

        console.error("end livestream error:", err);

      }

    });



    // =========================
    // COMMENT
    // =========================
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



    // =========================
    // PIN PRODUCT
    // =========================
    socket.on("updateLiveProduct", (data) => {

      const { livestreamId } = data;

      io.to(livestreamId).emit(
        "updateLiveProducts",
        data
      );

    });



    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {

      const livestreamId = socket.roomId;

      if (
        livestreamId &&
        viewerCounts[livestreamId] &&
        viewerCounts[livestreamId] > 0
      ) {

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