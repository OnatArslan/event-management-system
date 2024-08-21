const { Event, User } = require("../models/index");

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
    const { title, description, location, date, time, image, categorieId } =
      req.body;

    const newEvent = await Event.create({
      title,
      description,
      location,
      date,
      time,
      image,
      categorieId,
      organizerId: req.user.id,
    });
    if (!newEvent) {
      return next(new Error(`Event not created!`));
    }
    res.status(200).json({
      status: `success`,
      message: `${newEvent.title} created successfully`,
      data: { newEvent },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    await Event.update(
      {
        title: req.body.title,
        date: new Date(`2024-11-29`),
      },
      {
        where: {
          id: req.params.eventId,
        },
      }
    );

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
    await Event.destroy({
      where: {
        id: req.params.eventId,
      },
      // Because of event model is paranoid if you want hard delete you must use force:true
      force: true,
    });
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
