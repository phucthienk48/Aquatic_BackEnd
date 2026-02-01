const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true, // mật khẩu dạng thường (nên hash sau)
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    /* ===== THÔNG TIN CÁ NHÂN ===== */
    avatar: {
      type: String, // URL ảnh (Cloudinary / local)
      default: "/images/default-avatar.png",
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
