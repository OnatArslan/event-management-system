const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

const authMiddleware = require(`../middlewares/authMiddleware`);

router.route(`/sign-in`).post(authController.signIn);
router.route(`/sign-up`).post(authController.signUp);
router.route(`/log-out`).get(authController.logOut);
router.route(`/forgot-password`).post(authController.forgotPassword);
router
  .route(`/reset-password/:passwordResetToken`)
  .patch(authController.resetPassword);

router.route(`/friends/follow/:userId`).post();

module.exports = router;
