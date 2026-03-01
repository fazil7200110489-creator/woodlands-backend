const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,

  // 🔥 NEW FIELD (Only addition)
  inStock: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
