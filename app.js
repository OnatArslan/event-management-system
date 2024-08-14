const express = require("express");

// Require neccessary packages
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// Define app
const app = express();

// Require routers...
const eventRouter = require(`./routers/eventRouter`);

// Adding neccessary middlewares
app.use(morgan(`combined`)); // http request logger middleware
app.use(bodyParser.json()); // get data in json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Allow all domains
app.use(helmet()); // Secure app
app.use(compression()); // Data compression for performance gain
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(`/api/v1/events`, eventRouter);

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
    message: err,
  });
});

// Export app for server.js
module.exports = app;
