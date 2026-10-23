
const express = require("express");
const router = express.Router();

const { getClasses } = require("../controllers/classesController");

router.get("/", getClasses);

module.exports = router;
