const express = require("express");
const { submitClaim } = require("../controllers/claimController");

const router = express.Router();

// Route to submit a claim (only if payment is confirmed)
router.post("/submit", submitClaim);

module.exports = router;
