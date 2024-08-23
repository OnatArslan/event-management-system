const { Review, User, Event } = require("../models/index");
const { sequelize } = require("../database/connection");
const { Sequelize } = require("sequelize");

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { eventId: req.params.eventId },
      attributes: {
        exclude: [`deletedAt`],
      },
    });
    if (!reviews) {
      return next(new Error(`Can not find reviews`));
    }
    res.status(200).json({
      status: `success`,
      data: { reviews },
    });
  } catch (err) {
    next(err);
  }
};

async function calculateRating(eventId) {
  const event = await Event.findByPk(eventId, {
    include: {
      model: Review,
      as: `eventReviews`,
      attributes: [],
    },
    attributes: {
      include: [
        [Sequelize.fn(`AVG`, Sequelize.col(`eventReviews.rating`)), `rating`],
      ],
    },
    group: [`Event.id`],
  });

  await Event.update(
    { rating: event.rating },
    { where: { id: eventId }, validate: true }
  );
}

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId, {
      attributes: {
        exclude: [`deletedAt`],
      },
      include: [
        {
          model: User,
          as: `reviewer`,
          attributes: [`username`, `email`],
        },
        {
          model: Event,
          as: `reviewedEvent`,
          attributes: [`title`, `location`, `date`],
        },
      ],
    });
    if (!review) {
      return next(new Error(`Can not find a review with given ID`));
    }
    res.status(200).json({
      status: `success`,
      data: { review },
    });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { rating, content } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const newReview = await Review.create({
      rating,
      content,
      userId,
      eventId,
    });
    if (!newReview) {
      return next(new Error(`Review can not created!`));
    }
    calculateRating(eventId);
    res.status(200).json({
      status: `success`,
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return next(new Error(`Can not find a review with given ID`));
    }
    if (review.userId !== req.user.id) {
      return next(new Error(`You can only update your reviews`));
    }
    const { rating, content } = req.body;
    await review.update({
      rating,
      content,
    });

    calculateRating(req.params.eventId);
    res.status(200).json({
      status: `success`,
      message: `Review successfully updated`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return next(new Error(`Can not find a review with given ID`));
    }
    if (review.userId !== req.user.id) {
      return next(new Error(`You can only delete your reviews`));
    }
    await review.destroy({
      force: true,
    });
    calculateRating(req.params.eventId);
    res.status(200).json({
      status: `success`,
      message: `Review successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};
