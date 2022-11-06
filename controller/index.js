const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.json({ message: "Welcome to responder!" });
});

module.exports = router;
