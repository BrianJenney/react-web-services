
const mongoose = require("mongoose");

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
  userName: {
    type: String,
    trim: true,
    unique: true
  },
  income:{
    type: Number
  },
  SSN:{
    type: Number,
    unique: true
  },
  userType:{
    type: String
  },
  // This will make a userCreated entry in our doc, by default the current time string.
  userCreated: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
