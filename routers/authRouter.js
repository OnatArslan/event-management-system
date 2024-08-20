const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route(`/sign-in`).post(authController.signIn);
router.route(`/sign-up`).post(authController.signUp);
router.route(`/log-out`).get(authController.logOut);

module.exports = router;
