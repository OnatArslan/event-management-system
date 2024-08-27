const express = require(`express`);

const authMiddleware = require(`../middlewares/authMiddleware`);

const followController = require(`../controllers/followController`);

const router = express.Router();

router.use(authMiddleware.protect);

router.route(`/followings`).get(followController.getFollowings);
router
  .route(`/followings/:followingId`)
  .delete(followController.removeFollowing);

router.route(`/followers`).get(followController.getFollowers);
router.route(`/followers/:followerId`).delete(followController.removeFollower);

router.route(`/:userId`).post(followController.sendFollowRequest);
router.route(`/requests`).get(followController.getFollowRequests);
router
  .route(`/requests/:requestId`)
  .post(followController.responseFollowRequest)
  .get(followController.getFollowRequest);

module.exports = router;
