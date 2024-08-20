const { User } = require("../models/index");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirmation, profileInfo } =
      req.body;
    const newUser = await User.create(
      {
        username,
        email,
        password,
        passwordConfirmation,
        profileInfo,
      },
      {}
    );
    if (!newUser) {
      return next(new Error(`Can not create user with given credentials`));
    }
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: `2 days`,
    });
    res.status(200).json({
      data: {
        user: newUser,
        token: token,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    res.status(200).json({
      data: `hello`,
    });
  } catch (error) {}
};
