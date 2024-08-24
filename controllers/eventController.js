const { Event, User, Review, Comment } = require("../models/index");

exports.getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, fields } = req.query;

    // Pagination
    const offset = (page - 1) * limit;
    const paginationOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    };

    // Sorting
    let sortOptions = {};
    if (sort) {
      const [field, order = `DESC`] = sort.split(`,`);
      // Validate sort field
      let isLegitField = false;
      for (const [key, value] of Object.entries(Event.getAttributes())) {
        if (key === field) {
          isLegitField = true;
        }
      }
      if (isLegitField) {
        sortOptions = { order: [[field, order.toUpperCase()]] };
      } else {
        return next(new Error(`Invalid sort field: ${field}`));
      }
    }
    // Default sort
    else {
      sortOptions = {
        order: [[`title`, `ASC`]],
      };
    }
    // Selecting fields
    const attributesOptions = fields ? { attributes: fields.split(`,`) } : {};

    const options = {
      ...sortOptions,
      ...paginationOptions,
      ...attributesOptions,
    };
    // give pagination sort and attributes in options field
    const { count, rows } = await Event.findAndCountAll({
      ...sortOptions,
      ...paginationOptions,
      ...attributesOptions,
      attributes: {
        exclude: [`categorieId`, `organizerId`, `deletedAt`],
      },
      include: {
        model: User,
        as: `organizer`,
        attributes: [`username`, `email`],
      },
    });

    res.status(200).json({
      status: "success",
      message: `Showing ${count} data on this page`,
      data: { events: rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId, {
      include: [
        {
          model: User,
          as: `organizer`,
          attributes: [`username`, `email`],
        },
        {
          model: Review,
          as: `eventReviews`,
        },
        {
          model: Comment,
          as: `eventComments`,
        },
      ],

      attributes: {
        exclude: [`categorieId`, `organizerId`, `deletedAt`],
      },
    });

    res.status(200).json({
      status: `success`,
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      date,
      time,
      image,
      categorieId,
      price,
      maxAttendees,
    } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      location,
      date,
      time,
      image,
      categorieId,
      organizerId: req.user.id,
      price,
      maxAttendees,
    });
    if (!newEvent) {
      return next(new Error(`Event can not created!`));
    }
    res.status(200).json({
      status: `success`,
      message: `${newEvent.title} created successfully`,
      data: { newEvent },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    await Event.update(req.body, {
      where: {
        id: req.params.eventId,
      },
    });

    res.status(200).json({
      status: `success`,
      message: `Event updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.destroy({
      where: {
        id: req.params.eventId,
      },
      // Because of event model is paranoid if you want hard delete you must use force:true
      force: true,
    });
    res.status(200).json({
      status: `success`,
      message: `Event deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.joinEvent = async (req, res, next) => {
  try {
    // 1- Get event with given Id and check if it is exist
    const event = await Event.findByPk(req.params.eventId, {
      include: {
        model: User,
        as: `participants`,
      },
    });
    if (!event) {
      return next(new Error(`Can not find any event`));
    }
    // 2- Compare the event's date with the current date.
    const dateCheck = event.date > Date.now();
    if (!dateCheck) {
      return next(new Error(`This event is not active!!!`));
    }
    // 3- Check if User already joined
    const isAlreadyJoined = await event.hasParticipant(req.user);
    if (isAlreadyJoined) {
      return next(new Error(`You are already joined this event!!!`));
    }

    // 4- Add User to Event
    await event.addParticipant(req.user);
    // Send success response
    res.status(200).json({
      status: `success`,
      message: `${req.user.username} successfully joined event:${event.title}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.leaveEvent = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      message: ``,
    });
  } catch (err) {
    next(err);
  }
};
