require("dotenv").config();
var path = require("path");
var cors = require("cors");
var logger = require("morgan");
var express = require("express");
var mongoose = require("mongoose");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var { devErrorHandler } = require("./helper/catchHandler");

var indexRouter = require("./routes/index");
var tasksRouter = require("./routes/task");
var usersRouter = require("./routes/user");

var app = express();
app.use(cors({ origin: "*" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("database connection successfull"))
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/api/auth", usersRouter);
app.use("/api/tasks", tasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/**
 * @Displaying error message for undefined Api's
 */
app.use("*", (req, res, next) => {
  return res.json({
    status: "fail",
    data: { url: "api not found" },
  });
});

app.use(devErrorHandler);

module.exports = app;
