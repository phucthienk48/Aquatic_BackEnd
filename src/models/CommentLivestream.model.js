const mongoose = require("mongoose");

const CommentLivestreamSchema = new mongoose.Schema(
  {
    livestreamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestream",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model(
  "CommentLivestream",
  CommentLivestreamSchema
);
