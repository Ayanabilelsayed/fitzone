
const express = require("express");
const router = express.Router();

const {
  getTrainers,
  getTrainerById,
  getAllTrainersForAdmin,
  addTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainersController");

const adminOnly = require("../middleware/adminOnly");

// Public routes
router.get("/", getTrainers);

// Admin routes
router.get("/admin", adminOnly, getAllTrainersForAdmin);
router.post("/", adminOnly, addTrainer);
router.put("/:id", adminOnly, updateTrainer);
router.delete("/:id", adminOnly, deleteTrainer);

// Keep this route after /admin
router.get("/:id", getTrainerById);

module.exports = router;
