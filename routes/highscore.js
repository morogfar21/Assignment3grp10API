const express = require('express');
const router = express.Router();
const ctrlHighScore = require('../controllers/highscoresController');

// Get highscore list
router.get('/highscorelist', ctrlHighScore.highscoreList);

// Add highscore to Db
router.post('/addhighscore', ctrlHighScore.addHighscore);

module.exports = router;