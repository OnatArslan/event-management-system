const express = require("express");

// Require neccessary packages
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require(`./strategies/local-strategy`);
// Define app
const app = express();

// Require routers...
const eventRouter = require(`./routers/eventRouter`);
const userRouter = require(`./routers/userRouter`);
const authRouter = require(`./routers/authRouter`);
const categorieRouter = require(`./routers/categorieRouter`);

// Using neccessary middlewares(packages)
app.use(morgan(`combined`)); // http request logger middleware
app.use(bodyParser.json()); // get data in json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true })); // Allow all domains
app.use(helmet()); // Secure app
app.use(compression()); // Data compression for performance gain
app.use(cookieParser());

// Session can not below the app.use(routers)
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60000 * 60 * 24,
    },
  })
);
// Auth package
app.use(passport.initialize());
app.use(passport.session());

// Using Routers
app.use(`/api/v1/events`, eventRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/categories`, categorieRouter);
app.use(`/api/v1/auth`, authRouter);

app.use(`*`, (req, res, next) => {
  res.status(500).json({
    status: `fail`,
    message: `This route is not working,Please try another`,
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    status: `fail`,
    message: err.stack,
    message2: err.message,
  });
});

// Export app for server.js
module.exports = app;
