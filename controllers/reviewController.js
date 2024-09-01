const { Review, User, Event } = require("../models/index");
const { sequelize } = require("../database/connection");
const { Sequelize, Op } = require("sequelize");

exports.getAllReviews = async (req, res, next) => {
  try {
    if (!req.params.eventId) {
      return next(new Error(`For reviews you must enter a event ID`));
    }
    const { count, rows } = await Review.findAndCountAll({
      where: { eventId: req.params.eventId },
      attributes: [`id`, `rating`, `content`, `createdAt`, `updatedAt`],
      include: [
        {
          model: User,
          as: `reviewer`,
          attributes: [`username`],
        },
      ],
      limit: 100,
    });
    if (count === 0) {
      res.status(200).json({
        status: `success`,
        message: `This event does not have any review!`,
      });
    }
    res.status(200).json({
      status: `success`,
      message: `Showing ${count} review on this page`,
      data: { reviews: rows },
    });
  } catch (err) {
    next(err);
  }
};

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
    if (!rating || !eventId) {
      return next(new Error(`rating or event ID is not given!!!`));
    }
    const newReview = await Review.create({
      rating,
      content,
      userId,
      eventId,
    });
    if (!newReview) {
      return next(new Error(`Review can not created!`));
    }

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

    res.status(200).json({
      status: `success`,
      message: `Review successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};
