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

  const user = await User.create({
    username: data.username,
    email: data.email,
    password: data.password,
    role: data.role || "user",
    avatar: data.avatar,
    phone: data.phone,
    address: data.address,
  });

  return await User.findById(user._id).select("-password");
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
  // Không cho update password ở API này (an toàn hơn)
  delete data.password;

  const user = await User.findByIdAndUpdate(
    id,
    {
      username: data.username,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
      phone: data.phone,
      address: data.address,
      isActive: data.isActive,
    },
    { new: true }
  ).select("-password");

  if (!user) throw new Error("Không tìm thấy user");
  return user;
};

/* ================= DELETE ================= */
exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("Không tìm thấy user");
  return true;
};
