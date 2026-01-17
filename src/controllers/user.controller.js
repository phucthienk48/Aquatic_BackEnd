const User = require("../models/User");
const userService = require("../services/user.service");

/* ================= CREATE ================= */
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existed = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existed)
      return res.status(400).json({ message: "User đã tồn tại" });

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ALL ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BY ID ================= */
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body
    );
    res.json({
      message: "Cập nhật user thành công",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
