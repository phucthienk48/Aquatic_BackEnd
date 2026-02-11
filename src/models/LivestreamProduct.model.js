const mongoose = require("mongoose");

const LivestreamProductSchema = new mongoose.Schema(
  {
    livestreamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestream",
      required: true,
      unique: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        isPinned: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "LivestreamProduct",
  LivestreamProductSchema
);
