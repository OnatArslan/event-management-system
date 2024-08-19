const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");
const strategy = require(`../strategies/local-strategy`);

router
  .route(`/login`)
  .get(passport.authenticate(`local`), authController.login);

module.exports = router;
