const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require(`bcrypt`);

exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirmation, profileInfo } =
      req.body;
    if (!username || !email || !password || !passwordConfirmation) {
      return next(new Error(`Missing credentials`));
    }
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
    // Send token via cookie
    res.cookie(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });
    // Send response with message
    res.status(200).json({
      status: `success`,
      message: `${newUser.username} is created successfuly`,
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // If email or password is not in req.body return Error
    if (!email || !password) {
      return next(new Error(`Missing credentials!`));
    }
    // Get user with given email
    const user = await User.scope(`withAll`).findOne({
      where: { email: email },
    });
    // If user with given email is not found return Error.
    if (!user) {
      return next(new Error(`User not found`));
    }
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    // If password is not correct return Error
    if (!match) {
      return next(new Error(`Invalid credentials`));
    }
    // If everything is correct, create the JWT token.

    res.status(200).json({
      data: `hello`,
    });
  } catch (err) {
    next(err);
  }
};