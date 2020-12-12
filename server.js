//Setting up webSocket
const ws = require('ws').Server
const http = require('http').createServer();
let app = require('./app');

// const server = http.createServer(function (request, response) {
//   console.log((new Date()) + ' Received request for ' + request.url);
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.write("Welcome to Node.js on OpenShift!\n\n");
//   response.end("Thanks for visiting us! \n");
// });

var wss = new ws({
  server: server,
});


server.on('request', app);

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


    console.log(object.token)
    console.log(object.score)
  }
});

server.listen(process.env.PORT || 8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});