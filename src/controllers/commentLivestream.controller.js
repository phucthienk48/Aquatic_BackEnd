const CommentLivestreamService = require(
  "../services/commentLivestream.service"
);

class CommentLivestreamController {
  static async create(req, res) {
    try {
      const { livestreamId, userId, content } = req.body;

      const comment =
        await CommentLivestreamService.create({
          livestreamId,
          userId,
          content,
        });

      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getByLivestream(req, res) {
    const comments =
      await CommentLivestreamService.getByLivestream(
        req.params.livestreamId
      );
    res.json(comments);
  }

  /*  XÓA 1 COMMENT*/
  static async delete(req, res) {
    const comment =
      await CommentLivestreamService.delete(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy comment" });
    }

    res.json({ message: "Đã xóa comment" });
  }
}

module.exports = CommentLivestreamController;
