const passport = require("passport");
const { Strategy } = require("passport-local");
const { User } = require(`../models/index`);
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {});

exports.strategy = passport.use(
  new Strategy({ usernameField: `email` }, async (username, password, done) => {
    try {
      const findUser = await User.scope(`withAll`).findOne({
        where: { email: username },
      });
      if (!findUser) {
        throw new Error(`User not found`);
      }
      console.log(password, findUser.password);

      bcrypt.compare(password, findUser.password).then((result) => {
        if (!result) {
          throw new Error(`Invalid credentials`);
        }
      });

      return done(null, findUser);
    } catch (err) {
      return done(err, null);
    }
  })
);
