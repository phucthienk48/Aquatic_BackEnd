const Livestream = require("../models/Livestream.model");
const CommentLive = require("../models/CommentLivestream.model");

class LivestreamService {
  /* TẠO PHÒNG */
  static async create(data) {
    return Livestream.create({
      ...data,
      status: "ended", // mặc định chưa live
    });
  }

  /* BẮT ĐẦU LIVESTREAM */
  static async start(id) {
    const room = await Livestream.findById(id);
    if (!room) return null;

    return Livestream.findByIdAndUpdate(
      id,
      {
        status: "live",
        startedAt: new Date(),
        endedAt: null, // reset khi start lại
      },
      { new: true }
    );
  }

  /* KẾT THÚC LIVESTREAM */
  static async end(id) {
    const room = await Livestream.findById(id);
    if (!room) return null;

    return Livestream.findByIdAndUpdate(
      id,
      {
        status: "ended",
        endedAt: new Date(),
      },
      { new: true }
    );
  }

  /*  CẬP NHẬT THÔNG TIN PHÒNG */
  static async update(id, data) {
    return Livestream.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
  }

  /*  XÓA PHÒNG LIVESTREAM*/
  static async delete(id) {
    const room = await Livestream.findById(id);
    if (!room) return null;

    //  Không cho xóa khi đang live
    if (room.status === "live") {
      throw new Error("Không thể xóa phòng khi đang livestream");
    }

    //  Xóa toàn bộ comment của phòng
    await CommentLive.deleteMany({ livestreamId: id });

    //  Xóa phòng
    return Livestream.findByIdAndDelete(id);
  }

  static async getAll() {
    return Livestream.find().sort({ createdAt: -1 });
  }

  static async getLive() {
    return Livestream.find({ status: "live" }).sort({
      startedAt: -1,
    });
  }

  static async getById(id) {
    return Livestream.findById(id);
  }
}

module.exports = LivestreamService;
