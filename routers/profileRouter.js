const express = require(`express`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const profileController = require(`../controllers/profileController`);

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route(`/`)
  .get(profileController.getMe)
  .patch(profileController.updateMe);

module.exports = router;
