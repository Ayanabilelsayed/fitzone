const express = require("express");
const router = express.Router();

const {
  getClasses,
  getAllClassesForAdmin,
  addClass,
  updateClass,
  deleteClass,
} = require("../controllers/classesController");

const adminOnly = require("../middleware/adminOnly");

router.get("/", getClasses);
router.get("/admin", adminOnly, getAllClassesForAdmin);
router.post("/", adminOnly, addClass);

// Edit class
router.put("/:id", adminOnly, updateClass);

// Delete class
router.delete("/:id", adminOnly, deleteClass);

module.exports = router;