const service = require("../services/FishCareKnowledge.service");

//  Create
exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//  Get all
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get by knowledgeId
exports.getById = async (req, res) => {
  try {
    const data = await service.getByKnowledgeId(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update
exports.update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete
exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
