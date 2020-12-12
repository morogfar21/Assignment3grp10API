require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors')
const http = require('http')
const ws = require('ws')

require('./models/db')

//remake routes and controllers as rest api
const authenticationRouter = require('./routes/authentication');
const highScoreRouter = require('./routes/highscore');

//Setting up server
const app = express();
const httpserver = http.createServer(app);
const wss = new ws.Server({
  server: httpserver
});

httpserver.listen(process.env.PORT || 8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

//Set up routes
app.use('/authentication', authenticationRouter);
app.use('/highscore', highScoreRouter);

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
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

//Setting up webSocket
//wss.handleUpgrade();

const scoreModel = require('./models/highscore');
wss.on('connection' , webscocket =>  {
  console.log("New connection");

  wss.clients.forEach(client => {
    scoreModel.find(function (err, doc){
      console.log(doc)
      client.send(JSON.stringify(doc))
    })
  })

  webscocket.onmessage = (message) => {
    var object = JSON.parse(message.data)


    // console.log(object.token)
    // console.log(object.score)
  }
});

module.exports = app;
