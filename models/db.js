var mongoose = require('mongoose');
// Connection URL
let dbURI = "mongodb+srv://group10:group10@cluster0.rzwhe.mongodb.net/group10assignment1";
//let dbUriNew= 'mongodb+srv://madsmads1:<password>@cluster0.mwaea.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

// For nodemon restarts                                 
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./highscore');
require('./user');


var Highscore = mongoose.model('Highscore');
var Dummyhighscore = new Highscore();
Dummyhighscore.name = "Mads";
Dummyhighscore.score = 400;

var User = mongoose.model('User');
var dummyUser = new User();
dummyUser.name = "madsmads1";
dummyUser.password = "madsmads1";


Dummyhighscore.save(function (err){
    // if(err) return handleError(err);
    console.log('highscore added: ' + Dummyhighscore)
});

dummyUser.save(function (err){
    // if(err) return handleError(err);
    console.log('User added: ' + dummyUser)
});

