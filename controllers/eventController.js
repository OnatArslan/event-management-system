// Importing data Models from models/index.js
const {
  Event,
  User,
  Review,
  Comment,
  Categorie,
  EventUser,
} = require("../models/index");
// Import Operators from sequelize
const { Op } = require(`sequelize`);

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
        exclude: [
          `categorieId`,
          `organizerId`,
          `createdAt`,
          `updatedAt`,
          `deletedAt`,
          `curAttendees`,
          `description`,
        ],
      },
      include: [
        {
          model: User,
          as: `organizer`,
          attributes: [`username`],
        },
        {
          model: Categorie,
          as: `category`,
          attributes: [`name`],
        },
      ],
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
          model: User,
          as: `participants`,
          attributes: [`username`, `email`],
          through: {
            attributes: [],
          },
        },
        {
          model: Review,
          as: `eventReviews`,
          attributes: [`rating`, `content`, `createdAt`],
          limit: 50,
          // Include reviewer for review
          include: {
            model: User,
            as: `reviewer`,
            attributes: [`username`],
          },
        },
        {
          model: Comment,
          as: `eventComments`,
          attributes: [`content`, `createdAt`],
          limit: 50,
          where: { parentCommentId: null },
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
        },
      ],
      attributes: {
        exclude: [`categorieId`, `organizerId`, `deletedAt`, `updatedAt`],
      },
    });
    if (!event) {
      return next(new Error(`Can not find any event with given ID`));
    }
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
    const event = await Event.findOne({
      where: { id: req.params.eventId, organizerId: req.user.id },
    });
    // Check event and user if current user is not creator of this event return error
    if (!event) {
      return next(new Error(`Event's organizer is not you!!`));
    }
    await event.delete({});
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
      return next(new Error(`Can not find any event with given ID`));
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

    // 4- Check if Event is full
    if (event.curAttendees >= event.maxAttendees) {
      return next(new Error(`Event is full`));
    }

    // 5- Create EventUser
    await EventUser.create({
      userId: req.user.id,
      eventId: event.id,
    });
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
    const event = await Event.findByPk(req.params.eventId, {
      include: {
        model: User,
        as: `participants`,
      },
    });
    // 1-Check if event exist
    if (!event) {
      return next(new Error(`Can not find any event with given ID`));
    }
    // 2-Check user was joined event
    const isJoined = await event.hasParticipant(req.user);
    // If user is not participant of event return error
    if (!isJoined) {
      return next(new Error(`You are not a participant of this event`));
    }
    // 3-Delete Join table and run afterDelete hook
    await EventUser.destroy({
      where: {
        userId: req.user.id,
        eventId: event.id,
      },
      // This used for update curUser hook
      individualHooks: true,
    });

    res.status(200).json({
      status: `success`,
      message: `${req.user.username} successfully leave event: ${event.title}`,
    });
  } catch (err) {
    next(err);
  }
};
