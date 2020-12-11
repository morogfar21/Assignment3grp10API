const mongoose = require('mongoose');
const HighscoreColl = mongoose.model('Highscore');
//const userColl = mongoose.model('User');


//POST add highscore
module.exports.addHighscore = async function (req, res) {
    const Username = req.body.name;
    const highscore = req.body.score;
    const newHighscore = await HighscoreColl.create({
        name: Username, 
        score: highscore
    }).catch(err => 
        res.status(400).json({
            "title": "Unable to submit highscore",
            "detail": err
        })
    );

    if(newHighscore != null) {
        res.status(201).json({
            "title": "Created",
            newHighscore
        });
    }
};


//GET list of highscores
module.exports.highscoreList = async function (req, res) {
    await HighscoreColl.find( function(err, highscore){
        if(err) {
            res.status(400).json({
                "title": "Unable to find highscore record",
                "detail": err
            });
        } else {
            res.status(200).json({
                "title": "data:",
                highscore
            });
        }
    });
};