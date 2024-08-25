const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require(`bcrypt`);

// Auth-------------------------------------
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: `2 days`,
    });
    // Send token via cookie
    res.cookie(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });

    res.status(200).json({
      status: `success`,
      message: `${user.username} is logged in successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      expires: new Date(0), // Set the cookie to expire immediately
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

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
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Change password(most important)
// Change email(it is important too)
// --------------------------------------Profile
// getMe -> Get my Profile Info
// Update me -> (password and email not included)
// Follow user
// Unfollow user
// Get followers
// Get followings
