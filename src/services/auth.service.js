const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

class AuthService {
  // ===== ĐĂNG KÝ =====
  static async register(data) {
    const { username, email, password, role } = data;

    const existed = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existed) throw new Error("Tài khoản đã tồn tại");

    const user = await User.create({
      username,
      email,
      password, // ✅ LƯU DẠNG THƯỜNG
      role: role || "user",
    });

    return user;
  }


    // ===== ĐĂNG NHẬP =====
  static async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    if (password !== user.password) {
      throw new Error("Mật khẩu không đúng");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user,
      accessToken,
      refreshToken,
    };
  }



  // ===== ĐĂNG XUẤT =====
  static async logout(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }
}

module.exports = AuthService;
