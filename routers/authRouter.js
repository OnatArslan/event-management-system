const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route(`/signIn`).get(authController.signIn);
router.route(`/signUp`).post(authController.signUp);

module.exports = router;
