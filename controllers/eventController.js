const Event = require("../models/event");

exports.getAllEvents = async (req, res, next) => {
  try {
    const { count, rows } = await Event.findAndCountAll();
    if (count === 0) {
      return next(new Error(`Can not find any event`));
    }
    res.status(200).json({
      status: `success`,
      message: `Showing ${count} data on this page`,
      data: { events: rows },
    });
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    res.status(200).json({
      status: `success`,
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      date: Date.now(),
    });
    res.status(200).json({
      status: `success`,

      data: { event },
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
