const Event = require("../models/event");

exports.getAllEvents = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
