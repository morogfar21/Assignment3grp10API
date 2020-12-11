const express = require('express');
const router = express.Router();
const ctrlHighScore = require('../controllers/highscoresController');

// Get highscore list
router.get('/highscoreList', ctrlHighScore.highscoreList);

// Add highscore to Db
router.post('/addHighscore', ctrlHighScore.addHighscore);

module.exports = router;