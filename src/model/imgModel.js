const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    author: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Img", imgSchema);