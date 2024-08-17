const Event = require("../models/event");

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

    const { count, rows } = await Event.findAndCountAll(options);

    if (count === 0) {
      return next(new Error("Cannot find any event"));
    }

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
