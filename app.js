require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors')

require('./models/db')

//remake routes and controllers as rest api
const authenticationRouter = require('./routes/authentication');
const workoutRouter = require('./routes/workout');
const exerciseRouter = require('./routes/exercise');

//Setting up server
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set up routes
app.use('/authentication', authenticationRouter);
app.use('/workout', workoutRouter);
app.use('/exercise', exerciseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.json({
    "message": 'Unknown endpoint.'
  });
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      "message": err.name + ": " + err.message
    });
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});



module.exports = app;
