// Dependency
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
    id: String,
    from: String,
    to: String,
    text: String,
    time: {
        type: Date,
        default: Date.now()
    }
});

// Create the "User" model with our UserSchema schema
var Messages = mongoose.model("Messages", MessagesSchema);

// Export the User model, so it can be used in server.js with a require
module.exports = Messages;
