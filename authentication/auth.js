const jwt = require('jsonwebtoken');

module.exports = {
    authenticateJWT: function(req, res, next) {
        const authheader = req.headers.authorization;
        if (authheader) {
          //gets token not bearer
          const token = authheader.split(' ')[1];
          console.log(token);
          jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
            if(err) { 
              console.log(err);
              return res.sendStatus(403);
            } else {
             req.user = user;   // Add to req object
             next();
            }
          });
        } else {
          res.status(401).send({ auth: false, message: 'No token provided.' })
        }
    }
};

