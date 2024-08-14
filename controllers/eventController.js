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
