const LivestreamRoom = require("../models/LivestreamRoom.model");

class LivestreamService {
  static async createRoom({ title, description }) {
    return LivestreamRoom.create({
      title,
      description,
      streamKey: "live_" + Date.now(),
    });
  }

  static async startLive(roomId) {
    return LivestreamRoom.findByIdAndUpdate(
      roomId,
      {
        status: "live",
        startTime: new Date(),
      },
      { new: true }
    );
  }

  static async endLive(roomId) {
    return LivestreamRoom.findByIdAndUpdate(
      roomId,
      {
        status: "ended",
        endTime: new Date(),
      },
      { new: true }
    );
  }

  static async pinProduct(roomId, productId) {
    return LivestreamRoom.findByIdAndUpdate(
      roomId,
      { $addToSet: { pinnedProducts: productId } },
      { new: true }
    );
  }

  static async getAllRooms() {
    return LivestreamRoom.find()
      .populate("pinnedProducts")
      .sort({ createdAt: -1 });
  }

  static async getRoomById(roomId) {
    return LivestreamRoom.findById(roomId)
      .populate("pinnedProducts");
  }
}

module.exports = LivestreamService;
