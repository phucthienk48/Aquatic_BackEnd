const CommentLivestream = require(
  "../models/CommentLivestream.model"
);
const User = require("../models/User");
const AutoOrderService = require("./autoOrder.service");

class CommentLivestreamService {
  /*  TẠO COMMENT (KHÔNG AUTH) */
  static async create({ livestreamId, userId, content }) {
    if (!userId) throw new Error("Thiếu userId");
    if (!content) throw new Error("Nội dung không được rỗng");

    // Kiểm tra user
    const user = await User.findById(userId).select(
      "_id username avatar phone address"
    );

    if (!user) throw new Error("User không tồn tại");

    // Tạo comment
    const comment = await CommentLivestream.create({
      livestreamId,
      user: userId,
      content,
    });

    // GỌI AUTO ORDER SERVICE
    await AutoOrderService.handle({
      livestreamId,
      userId,
      content,
    });

    // Trả về comment đã populate
    return comment.populate("user", "username avatar");
  }

  /*  LẤY COMMENT THEO LIVESTREAM */
  static async getByLivestream(livestreamId) {
    return CommentLivestream.find({ livestreamId })
      .populate("user", "username avatar")
      .sort({ createdAt: 1 });
  }
}

module.exports = CommentLivestreamService;
