const { Comment } = require(`../models/index`);

exports.getAllChildComments = async (req, res, next) => {
  try {
    const parentComment = await Comment.findByPk(req.params.commentId);
    if (!parentComment) {
      return next(new Error(`Can not find any comment with given ID`));
    }
    const childComments = await Comment.findAll({
      where: {
        parentCommentId: parentComment.id,
        eventId: parentComment.eventId,
      },
    });
    if (!childComments) {
      return next(
        new Error(`Can not find any child comment with given parent ID`)
      );
    }
    res.status(200).json({
      status: `success`,
      data: { comment: parentComment, replies: childComments },
    });
  } catch (err) {
    next(err);
  }
};

exports.createChildComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const parentCommentId = req.params.commentId;

    const parentComment = await Comment.findByPk(parentCommentId);
    if (!parentComment) {
      return next(
        new Error(`Can not create a child comment without parent comment`)
      );
    }
    const childComment = await Comment.create({
      content,
      userId,
      parentCommentId: parentComment.id,
      eventId: parentComment.eventId,
    });
    if (!childComment) {
      return next(new Error(`Child comment can not created`));
    }
    res.status(200).json({
      status: `success`,
      data: {
        childComment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateChildComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const childId = req.params.replieId;
    const childComment = await Comment.findByPk(childId);
    if (!childComment) {
      return next(new Error(`Can not find replie`));
    }
    if (childComment.userId !== req.user.id) {
      return next(new Error(`Can not update other user's comment!!`));
    }
    await childComment.update({ content: content });
    res.status(200).json({
      status: `success`,
      data: {
        childComment,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteChildComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const childId = req.params.replieId;
    const childComment = await Comment.findByPk(childId);
    if (!childComment) {
      return next(new Error(`Can not find replie`));
    }
    if (childComment.userId !== req.user.id) {
      return next(new Error(`Can not delete other user's comment!!`));
    }
    await childComment.destroy();
    res.status(200).json({
      status: `success`,
      message: `Replie  is deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
