const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// These router for only admins

router
  .route(`/`)
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route(`/:id`).patch(userController.updateUser);

module.exports = router;
