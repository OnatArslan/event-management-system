const express = require("express");

const authMiddleware = require(`../middlewares/authMiddleware`);

const commentController = require(`../controllers/commentController`);
const nestedCommentController = require(`../controllers/nestedCommentController`);

// Create a router with mergeParams to handle nested routes
const router = express.Router({ mergeParams: true });

// Routes for comments on events (reviews)
router
  .route(`/`)
  .get(commentController.getAllEventComments) // Get all comments for a given event
  .post(authMiddleware.protect, commentController.createCommentOnEvent); // Create a comment on an event

router
  .route(`/:commentId`)
  .get(commentController.getEventComment) // Get a specific comment by ID
  .patch(authMiddleware.protect, commentController.updateCommentOnEvent) // Update a comment on an event
  .delete(authMiddleware.protect, commentController.deleteCommentOnEvent); // Delete a comment on an event

// Routes for nested comments (replies to comments)
router
  .route(`/:commentId/replies`)
  .post(authMiddleware.protect, nestedCommentController.createChildComment) // Create a reply to a comment
  .get(nestedCommentController.getAllChildComments); // Get all replies to a specific comment

router
  .route(`/:commentId/replies/:replieId`)
  .patch(authMiddleware.protect, nestedCommentController.updateChildComment)
  .delete(authMiddleware.protect);

module.exports = router;
