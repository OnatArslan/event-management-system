const passport = require("passport");
const { Strategy } = require("passport-local");
const { User } = require(`../models/index`);
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log(`Inside serialize user function`);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.scope(`withAll`).findByPk(id);
    if (!findUser) throw new Error(`User not found`);
    console.log(`Inside deserialize user function`);

    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

exports.strategy = passport.use(
  new Strategy({ usernameField: `email` }, async (username, password, done) => {
    try {
      const findUser = await User.scope(`withAll`).findOne({
        where: { email: username },
      });
      if (!findUser) {
        throw new Error(`User not found`);
      }

      const match = await bcrypt.compare(password, findUser.password);

      if (!match) {
        throw new Error(`Invalid credentials`);
      }
      return done(null, findUser);
    } catch (err) {
      return done(err, null);
    }
  })
);
