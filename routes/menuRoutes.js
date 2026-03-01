const router = require("express").Router();
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

// ================================
// ADD MENU (Admin only)
// ================================
router.post("/add", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, description, price, image, category } = req.body;

    const menu = new Menu({
      name,
      description,
      price,
      image,
      category
    });

    await menu.save();
    res.json({ message: "Menu Added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================================
// GET ALL MENU (Public)
// ================================
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================================
// UPDATE MENU (Admin only)
// ================================
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Menu Updated Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================================
// DELETE MENU (Admin only)
// ================================
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({ message: "Menu Deleted Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// TOGGLE STOCK (Admin only)
router.put("/toggle-stock/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const menu = await Menu.findById(req.params.id);

    menu.inStock = !menu.inStock;

    await menu.save();

    res.json({ message: "Stock Updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
