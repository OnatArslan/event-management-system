const express = require(`express`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const followController = require(`../controllers/followController`);

const router = express.Router();

router.use(authMiddleware.protect);

router.route(`/followings`).get(followController.getFollowings);

router.route(`/:userId`).get(followController.sendFollowRequest);

module.exports = router;
