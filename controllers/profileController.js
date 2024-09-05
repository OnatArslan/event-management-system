const { User } = require(`../models/index`);

// Profile related controllers
exports.getMe = async (req, res, next) => {
  try {
    // 1) Get user with req.user
    const user = req.user;
    if (!user) {
      return next(new Error(`Something went wrong`));
    }

    res.status(200).json({
      status: `success`,
      data: {
        ProfileData: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // Validate req.body
    if (req.body.password || req.body.role) {
      return next(
        new Error(
          `Can not change password or role in this route.Please try /changePassword for this`
        )
      );
    }
    // 1) Get and check user
    const user = req.user;
    if (!user) {
      return next(new Error(`Something went wrong`));
    }
    // 2) Get and check given data if data contains not allowed fields return error
    const { username, email, profileInfo } = req.body;

    await user.update({ username, email, profileInfo });

    res.status(200).json({
      status: `success`,
      message: `${user.username} updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};
