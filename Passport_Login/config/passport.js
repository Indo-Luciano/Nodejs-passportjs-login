const localStrategy = require("passport-local").Strategy;
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

// Load User Model
const User = require("../models").User;

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ where: { email: email } })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          //   console.log(user);
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
          //   console.log(user.password);
        })
        .catch((err) => console.log(err));
    })
  );

  // Serialize & Deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log(user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id, (err, user) => {
      done(err, user);
      console.log(id);
      return done;
    });
    console.log("passport finished");
  });
};
