const mongoose = require("mongoose");

function normalizeUsername(username) {
  return String(username || "")
    .trim()
    .toLowerCase();
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    normalizedUsername: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("validate", function setNormalizedUsername(next) {
  this.normalizedUsername = normalizeUsername(this.username);
  next();
});

module.exports = mongoose.model("User", userSchema);
module.exports.normalizeUsername = normalizeUsername;
