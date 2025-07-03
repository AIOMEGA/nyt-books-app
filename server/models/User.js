const mongoose = require("mongoose");

// Basic user account schema used for authentication
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
});

module.exports = mongoose.model("User", userSchema);
