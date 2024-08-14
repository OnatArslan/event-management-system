const express = require("express");

const router = express.Router();

router.get(`/`, (req, res, next) => {
  res.status(400).json({ message: `hello world` });
});

module.exports = router;
