const express = require('express');
const router = express.Router();
const ctrlHighScore = require('../controllers/highscoresController');
const auth = require('../authentication/auth');

// Get highscore list
router.get('/highscorelist', auth.authenticateJWT ,ctrlHighScore.highscoreList);

// Add highscore to Db
router.post('/addhighscore', auth.authenticateJWT ,ctrlHighScore.addHighscore);

module.exports = router;