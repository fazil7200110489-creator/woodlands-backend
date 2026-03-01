const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalAmount: Number,

  transactionId: String,
  paymentScreenshot: String,

  orderStatus: {
    type: String,
    enum: [
      "Pending Verification",
      "Paid",
      "Preparing",
      "Ready",
      "Completed"
    ],
    default: "Pending Verification"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
