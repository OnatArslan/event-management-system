const express = require("express");

const nestedCommentController = require(`../controllers/nestedCommentController`);

const router = express.Router({ mergeParams: true });

router.route(`/`).get(nestedCommentController.getAllComments);

module.exports = router;
