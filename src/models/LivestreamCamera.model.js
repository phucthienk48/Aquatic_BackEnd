const mongoose = require("mongoose");

const LivestreamCameraSchema = new mongoose.Schema({

  livestreamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Livestream",
    required: true
  },

  isCameraOn: {
    type: Boolean,
    default: false
  },

  startedAt: Date,

  endedAt: Date

});

module.exports = mongoose.model(
  "LivestreamCamera",
  LivestreamCameraSchema
);