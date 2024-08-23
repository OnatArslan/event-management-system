const { Comment } = require(`../models/index`);
const { Op } = require(`sequelize`);

// Controllers for event comments
exports.getAllEventComments = async (req, res, next) => {
  try {
    const eventComments = await Comment.findAll({
      where: {
        eventId: req.params.eventId,
        parentCommentId: { [Op.eq]: null },
      },
    });
    res.status(200).json({
      status: `success`,
      data: { eventComments },
    });
  } catch (err) {
    next(err);
  }
};

exports.createCommentOnEvent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const newComment = await Comment.create({
      content,
      userId,
      eventId,
    });
    if (!newComment) {
      return next(new Error(`Review can not created`));
    }
    res.status(200).json({
      status: `success`,
      data: { newComment },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCommentOnEvent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const comment = await Comment.findByPk(req.params.commentId, {
      where: { eventId: eventId },
    });

    if (!comment) {
      return next(new Error(`Can not find this comment`));
    }

    if (comment.userId !== req.user.id) {
      return next(new Error(`You can only update your comments`));
    }
    await comment.update({ content });
    res.status(200).json({
      status: `success`,
      data: `Comment updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentOnEvent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const comment = await Comment.findByPk(req.params.commentId, {
      where: { eventId: eventId },
    });
    if (!comment) {
      return next(new Error(`Can not find this comment`));
    }
    if (comment.userId !== req.user.id) {
      return next(new Error(`You can only delete your comments`));
    }
    await comment.destroy({ force: true });
    res.status(200).json({
      status: `success`,
      data: `Comment deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};
