const express = require("express");

const authMiddleware = require(`../middlewares/authMiddleware`);

const commentController = require(`../controllers/commentController`);
const nestedCommentController = require(`../controllers/nestedCommentController`);

// Because of reviews must have event I will use nested routes
// mergeParams:true option for this
// all routes in this route like api/v1/events/:eventId/comments/:commentId format
const router = express.Router({ mergeParams: true });

// this route is for 127.0.0.1:3000/api/v1/events/:eventId/omments
router.route(`/`).get(commentController.getAllEventComments); // Get all comment of given event
router.route(`/:commentId`).get(); // Get one comment with given Id

router.use(authMiddleware.protect);

router.route(`/`).post(commentController.createCommentOnEvent); // create comment on event
router
  .route(`/:commentId`)
  .patch(commentController.updateCommentOnEvent)
  .delete(commentController.deleteCommentOnEvent)
  .post();

module.exports = router;
