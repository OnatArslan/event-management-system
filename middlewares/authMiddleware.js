const jwt = require("jsonwebtoken");
const { User } = require(`../models/index`);

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new Error(`Authentication token is missing`));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return next(new Error(`Invalid or expired token`));
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new Error(`User belonging to this token does not exist`));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
