const LivestreamService = require("../services/livestream.service");

class LivestreamController {

  static async create(req, res) {
    try {
      const room = await LivestreamService.create(req.body);
      res.status(201).json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async start(req, res) {
    try {
      const room = await LivestreamService.start(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phòng livestream" });
      }
      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async end(req, res) {
    try {
      const room = await LivestreamService.end(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phòng livestream" });
      }
      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const room = await LivestreamService.update(
        req.params.id,
        req.body
      );

      if (!room) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phòng livestream" });
      }

      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const room = await LivestreamService.delete(req.params.id);

      if (!room) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phòng livestream" });
      }

      res.json({
        message: "Đã xóa phòng livestream và toàn bộ bình luận",
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req, res) {
    const rooms = await LivestreamService.getAll();
    res.json(rooms);
  }

  static async getLive(req, res) {
    const rooms = await LivestreamService.getLive();
    res.json(rooms);
  }

  static async getDetail(req, res) {
    const room = await LivestreamService.getById(req.params.id);
    if (!room) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng livestream" });
    }
    res.json(room);
  }
}

module.exports = LivestreamController;
