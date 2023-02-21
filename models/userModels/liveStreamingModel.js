const mongoose = require("mongoose");
const liveStreamingModel = mongoose.Schema(
  {
    liveUrl: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
    },
    requested: {
      type: String,
      default: "false",
    },
    approved: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("LiveStreaming", liveStreamingModel);
