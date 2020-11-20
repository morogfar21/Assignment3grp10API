const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/authenticationController');

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;