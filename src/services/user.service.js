const User = require("../models/User");

/* ================= CREATE ================= */
exports.createUser = async (data) => {
  const { username, email } = data;

  const exists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exists) {
    throw new Error("Username hoặc Email đã tồn tại");
  }

  const user = await User.create(data);
  return user;
};

/* ================= GET ALL ================= */
exports.getAllUsers = async () => {
  return await User.find().select("-password");
};

/* ================= GET BY ID ================= */
exports.getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("Không tìm thấy user");
  return user;
};

/* ================= UPDATE ================= */
exports.updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password");

  if (!user) throw new Error("Không tìm thấy user");
  return user;
};

/* ================= DELETE ================= */
exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("Không tìm thấy user");
  return true;
};
