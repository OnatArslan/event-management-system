const { Comment } = require(`../models/index`);

exports.getAllComments = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
