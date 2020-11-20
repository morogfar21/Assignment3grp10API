const mongoose = require('mongoose');

const highscoreSchema = new mongoose.Schema({
    name: {
    type: String  
    },
    score: {
    type: Number // or String
    }
});

const Highscore = mongoose.model('Highscore', highscoreSchema);
module.exports = Highscore;