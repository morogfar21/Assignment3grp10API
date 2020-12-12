require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors')

require('./models/db')

//remake routes and controllers as rest api
const authenticationRouter = require('./routes/authentication');
const highScoreRouter = require('./routes/highscore');

//Setting up server
const app = express();
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
const ws = require('ws').Server
const http = require('http');

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("Welcome to Node.js on OpenShift!\n\n");
  response.end("Thanks for visiting us! \n");
});

var wss = new ws({
  server: server,
});

wss.handleUpgrade();

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


    console.log(object.token)
    console.log(object.score)
  }
});

// server.listen(process.env.PORT || 8080, function () {
//   console.log((new Date()) + ' Server is listening on port 8080');
// });

module.exports = app;
