const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
