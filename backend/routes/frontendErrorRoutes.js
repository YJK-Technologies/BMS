// routes/frontendErrorRoutes.js
const express = require("express");
const router = express.Router();
const saveErrorLog = require("../controllers/logger");  

router.post("/log-frontend-error", (req, res) => {
  const { user, errorMessage, page } = req.body;

  try {
    saveErrorLog({
      user: user || "FrontendUser",
      spName: page || "FrontendError",
      errorMessage: errorMessage || "Unknown frontend error",
    });

    res.status(200).json({ success: true, message: "Frontend error logged" });
  } catch (err) {
    console.error("Error saving frontend log:", err);
    res.status(500).json({ success: false, message: "Failed to log error" });
  }
});

module.exports = router;
