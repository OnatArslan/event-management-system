const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require(`bcrypt`);
const transporter = require(`../utils/mailer`);

const crypto = require(`node:crypto`);

// Auth related controllers
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
      message: `${newUser.username} is created and logged in successfuly`,
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new Error(`Missing credentials`));
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return next(new Error(`Can not find any user with given email`));
    }
    // Create password reset token and hash for save in user field
    const plainToken = crypto.randomBytes(32).toString(`hex`);
    const hashedToken = crypto
      .createHash(`sha256`)
      .update(plainToken)
      .digest(`hex`);
    // Update users fields and save user
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    await user.save({ validate: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${plainToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await transporter.sendMail({
        from: `Eventy support`,
        to: user.email,
        subject: `Here is your password reset token (valid for 10 minutes)`,
        text: `${plainToken}`,
      });
      res.status(200).json({
        status: `success`,
        message: `Password reset token send to your email`,
        dataTest: {
          user,
        },
      });
    } catch (err) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save({ validate: false });
      return res.status(500).json({
        status: `fail`,
        message: `There was an error sending the email.Try again later`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get request data and check if exists
    const { email, password, passwordConfirmation } = req.body;
    const plainToken = req.params.passwordResetToken;
    if (!email || !plainToken) {
      return next(new Erro(`Missing credentials`));
    }
    // 2) Get user with given data and check it
    const user = await User.scope(`withAll`).findOne({
      where: { email: email },
    });
    if (!user) {
      return next(new Error(`Can not find any user with given email!`));
    }

    const hashedToken = crypto
      .createHash(`sha256`)
      .update(plainToken)
      .digest(`hex`);

    if (user.passwordResetToken !== hashedToken) {
      return next(new Error(`Invalid token`));
    }
    if (Date.now() > user.passwordResetExpires) {
      return next(new Error(`Token has expired`));
    }
    await user.update({
      password: password,
      passwordConfirmation,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
    res.status(200).json({
      status: `success`,
      message: user,
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
