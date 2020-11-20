const mongoose = require('mongoose');
const UserColl = mongoose.model('User');

//post user
module.exports.register = async function (req, res) {
    const {username, password, password2} = req.body;
    console.log(' username ' + username+ ' pass:' + password);
    if(!username || !password || !password2) {
        res.status(400).json({
            "title": "Invalid format",
            "detail": "All fields required"
        });
    }

    //check if match
    if(password !== password2) {
        console.log("password != password2");
        res.status(400).json({
            "title": "Invalid format",
            "detail": "Passwords dosen't match"
        });
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        console.log("password < 6");
        res.status(400).json({
            "title": "Invalid format",
            "detail": "Passwords too Short, should be more than 6 characters"
        });
    } else {
        //Create user.
        console.log("so far soo god");
        const newUser = new UserColl({
            username: username,
            password: password,
            workouts: []
        });
        await newUser.setPassword(password);
        newUser.save(function (err) {
            if(err) {
                res.status(400).json({
                    "title": "Failed to create user account",
                    "detail": `Failed to create user account because: ${err.message}.`
                });
            } else {
                const token = newUser.generateJwt();
                res.status(201).json({"token": token});
            }
        });
    }
};

//get login
module.exports.login = async function (req, res) {
    const {username, password} = req.body

    const user = await UserColl.findOne({username: username})
    .catch(err =>
        res.status(400).json({
            "title": "Failed to find user account",
            "detail": `Failed to find user account because: ${err.message}.`
        })
    )

    const valid = await user.validPassword(password);

    if (valid) {
        const token = user.generateJwt();
        res.status(200).json({
          "token": token
        });
    } else {
        res.status(401).json({
           "title": "Unauthorized",
           "detail": "Wrong password"
        });
    }
};

module.export

