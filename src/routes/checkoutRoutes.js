const express = require("express");
const checkoutController = require("../controllers/checkoutController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", authMiddleware, checkoutController.checkout);

module.exports = router;
