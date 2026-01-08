const mongoose = require("mongoose");

const InstructionSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String, // image URL
      default: "",
    },
  },
  { _id: false }
);

const FishCareKnowledgeSchema = new mongoose.Schema(
  {
    knowledgeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true,
    },

    instructions: {
      type: [InstructionSectionSchema],
      required: true,
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        "Instruction must have at least one section",
      ],
    },

    img: {
      type: String, // ảnh đại diện bài viết
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "FishCareKnowledge",
  FishCareKnowledgeSchema
);
