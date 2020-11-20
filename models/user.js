const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltrounds = 10;

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    unique: true,
    required: true
    },
    password: {
    type: String,
    required: true
    },
    hash: String,
    highscore: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Highscore"
    }]
});

userSchema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 1); // Use 1 hour for better security
    
    return jwt.sign({
        id: this._id,
        username: this.username,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000), // as Unix time in seconds,
    }, process.env.JWT_SECRET, // DO NOT KEEP YOUR SECRET IN THE CODE!
        {
            algorithm: 'HS256'
        });
};

userSchema.methods.setPassword = async function (password) {
    this.hash = await bcrypt.hashSync(password, saltrounds);
};

userSchema.methods.validPassword = async function ( password) {
    return await bcrypt.compareSync(password, this.hash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
