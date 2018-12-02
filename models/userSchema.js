const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password: {
        type: String,
        trim: true,
        required: "Password is Required",
        validate: [
            function(input) {
                return input.length >= 6;
            },
            "Password should be longer."
        ]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: [/\d/g.length === 10, "Please enter a valid phone number"]
    },
    userPic: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        trim: true,
        unique: true
    },
    income: {
        type: Number
    },
    SSN: {
        type: Number,
        unique: true
    },
    userType: {
        type: String
    },
    liked: [
        {
            type: String
        }
    ],
    // This will make a userCreated entry in our doc, by default the current time string.
    userCreated: {
        type: Date,
        default: Date.now
    }
});

// hash the password
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
