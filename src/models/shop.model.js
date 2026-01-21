const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    logo: {
      type: String // URL Cloudinary
    },
    banner: {
      type: String // URL Cloudinary
    },
    workingTime: {
      type: String
    },
    facebook: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Shop", shopSchema);
