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

// Routes for profile
router.use(authMiddleware.protect);
router
  .route(`/profile`)
  .get(authController.getMe)
  .patch(authController.updateMe);

module.exports = router;
