
const express = require("express");
const router = express.Router();

const {
  getTrainers,
  getTrainerById,
} = require("../controllers/trainersController");

router.get("/", getTrainers);
router.get("/:id", getTrainerById);

module.exports = router;
