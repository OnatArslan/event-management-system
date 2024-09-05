const { Comment, User, Event } = require(`../models/index`);
const { Op } = require(`sequelize`);

// Controllers for event comments
exports.getAllEventComments = async (req, res, next) => {
  try {
    let comments;
    if (req.params.eventId) {
      comments = await Comment.findAll({
        where: {
          eventId: req.params.eventId,
          parentCommentId: { [Op.eq]: null },
        },
        attributes: [`id`, `content`, `createdAt`],
        include: [
          {
            model: User,
            as: `author`,
            attributes: [`username`],
          },
          {
            model: Comment,
            as: `replies`,
            attributes: [`content`, `createdAt`],
            include: {
              model: User,
              as: `author`,
              attributes: [`username`],
            },
          },
        ],
      });
    } else {
      return next(new Error(`Event ID is missing`));
    }
    if (!comments) {
      return next(new Error(`Can not find any comments on database`));
    }
    res.status(200).json({
      status: `success`,
      data: { comments },
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId, {
      where: {
        eventId: { [Op.ne]: null },
      },
      attributes: [`content`, `createdAt`],
      include: [
        {
          model: User,
          as: `author`,
          attributes: [`username`],
        },
        {
          model: Comment,
          as: `replies`,
          attributes: [`content`, `createdAt`],
          include: {
            model: User,
            as: `author`,
            attributes: [`username`],
          },
        },
      ],
    });
    if (!comment) {
      return next(new Error(`Can not find any comment on database`));
    }
    res.status(200).json({
      status: `success`,
      data: { comment },
    });
  } catch (err) {
    next(err);
  }
};

exports.createCommentOnEvent = async (req, res, next) => {
  try {
    const { content } = req.body;
    const eventId = req.params.eventId;
    if (!eventId) {
      return next(new Error(`Event ID is missing`));
    }
    const event = await Event.findByPk(eventId);
    if (!event) {
      return next(new Error(`Can not find any event with given ID`));
    }
    const newComment = await Comment.create({
      content,
      userId: req.user.id,
      eventId,
    });
    if (!newComment) {
      return next(new Error(`Review can not created`));
    }
    res.status(200).json({
      status: `success`,
      message: `Comment created on event: ${event.title}.`,
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
