const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      phone,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User Registered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    // increase login count
user.loginCount += 1;
await user.save();


    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET LOGIN STATS (Admin)
router.get("/stats/logins", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    const totalLogins = users.reduce(
      (sum, user) => sum + user.loginCount,
      0
    );

    res.json({
      totalUsers: users.length,
      totalLogins
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
