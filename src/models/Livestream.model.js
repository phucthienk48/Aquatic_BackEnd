const mongoose = require("mongoose");

const LivestreamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "live", "ended"],
      default: "pending",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Livestream", LivestreamSchema);
