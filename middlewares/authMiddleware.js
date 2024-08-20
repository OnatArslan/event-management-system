const jwt = require("jsonwebtoken");
const { User } = require(`../models/index`);

exports.protect = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;
    if (!token) {
      return next(new Error("Authentication token is missing"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(new Error("Invalid or expired token"));
    }

    // Fetch user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new Error("User belonging to this token does not exist"));
    }

    // console.log(user.passwordChangedAt.getTime()); // 1724126160176
    // console.log(decoded.iat); // 1724126217

    // Check if user changed password after the token was issued(we multiply by 1000 because of decoded.iat is 10 digit other is 13)
    if (user.passwordChangedAt.getTime() > decoded.iat * 1000) {
      return next(
        new Error("User recently changed their password, please log in again.")
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.restrict = (roles) => {
  return (req, res, next) => {
    // This is not neccessary but for one reason our protect middleware was broken this statament could save the day :)
    if (!req.user || !req.user.role) {
      return next(new Error(`User role is not defined`));
    }
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new Error(`Only ${roles} can access this route`));
    }
    // Proceed to the next middleware or route handler
    next();
  };
};
