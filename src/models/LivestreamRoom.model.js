const mongoose = require("mongoose");

const livestreamRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    streamKey: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "live", "ended"],
      default: "pending",
    },

    startTime: Date,
    endTime: Date,

    pinnedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    viewersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LivestreamRoom", livestreamRoomSchema);
