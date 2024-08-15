const { User } = require(`../models/index`);

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      return next(new Error(`Can not create user`));
    }
    res.status(200).json({
      status: `success`,
      message: `${user.username} successfully created`,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return next(new Error(`Something went wrong`));
    }
    res.status(200).json({
      status: `success`,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
