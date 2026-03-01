const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

console.log("🔥 Order routes loaded");

// PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      transactionId,
      paymentScreenshot
    } = req.body;

    const order = new Order({
      userId,
      items,
      totalAmount,
      transactionId,
      paymentScreenshot,
      orderStatus: "Pending Verification"
    });

    await order.save();

    res.json({ message: "Order Submitted 🔥" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CONFIRM PAYMENT
router.put("/confirm/:id", async (req, res) => {
  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: "Paid" },
      { new: true }
    );

    const io = req.app.get("io");

    // 🔥 Send FULL order to that user
    io.to(order.userId).emit("orderConfirmed", {
      message: "Payment Approved! Generating Bill...",
      order: order
    });

    res.json({ message: "Payment Confirmed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// READY
router.put("/ready/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: "Ready" },
      { new: true }
    );

    const io = req.app.get("io");

    io.to(order.userId).emit("orderReady", {
      message: "Your order is ready! 🍽️"
    });

    res.json({ message: "Order marked Ready" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// MONTHLY REVENUE
// MONTHLY REVENUE FIRST
router.get("/monthly-revenue", async (req, res) => {
  try {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      orderStatus: "Ready",
      createdAt: { $gte: startOfMonth }
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      orders
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// THEN this
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
