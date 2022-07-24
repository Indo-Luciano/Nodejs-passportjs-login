const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql2");
const sequelize = require("sequelize");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Passport config
require("./config/passport")(passport);

// DB Config
// const db = require("./config/keys").conDB;
const conDB = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: `passport_login`,
});

// Connect to MySQL
conDB.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const db = require("./models");

// Checks for table each time server is run
db.sequelize.sync().then((req) => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, console.log(`Server started on port ${PORT}`));
});
