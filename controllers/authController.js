const { User } = require("../models/index");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    res.status(200).json({
      data: `hello`,
    });
  } catch (error) {}
};

exports.signIn = async (req, res, next) => {
  try {
    res.status(200).json({
      data: `hello`,
    });
  } catch (error) {}
};
