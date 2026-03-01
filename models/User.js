const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: String,
  email: String,
  password: String,

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },

  // 🔥 ADD THIS
  loginCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
