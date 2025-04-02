const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Middleware to check if ID is provided
const validateIdParam = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Category ID is required" });
  }
  next();
};

// 🟢 Create a new category
router.post("/", createCategory);

// 🟢 Get all categories
router.get("/", getCategories);

// 🟢 Update a category (requires a valid ID)
router.put("/:id", validateIdParam, updateCategory);

// 🟢 Delete a category (requires a valid ID)
router.delete("/:id", validateIdParam, deleteCategory);

module.exports = router;
