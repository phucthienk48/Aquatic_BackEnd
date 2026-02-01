const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    images: [String],
  },
  { timestamps: true }
);

/*  CHỐNG ĐÁNH GIÁ TRÙNG */
CommentSchema.index(
  { user: 1, product: 1, order: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

