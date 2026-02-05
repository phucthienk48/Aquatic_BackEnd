const LivestreamService = require("../services/livestream.service");

exports.createRoom = async (req, res) => {
  try {
    const room = await LivestreamService.createRoom({
      title: req.body.title,
      description: req.body.description,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.startLive = async (req, res) => {
  const room = await LivestreamService.startLive(req.params.id);
  res.json(room);
};

exports.endLive = async (req, res) => {
  const room = await LivestreamService.endLive(req.params.id);
  res.json(room);
};

exports.pinProduct = async (req, res) => {
  const room = await LivestreamService.pinProduct(
    req.params.id,
    req.body.productId
  );
  res.json(room);
};

exports.getAllRooms = async (req, res) => {
  const rooms = await LivestreamService.getAllRooms();
  res.json(rooms);
};

exports.getRoomDetail = async (req, res) => {
  const room = await LivestreamService.getRoomById(req.params.id);
  res.json(room);
};
