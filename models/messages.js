
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    id: String,
    from: String,
    to: String,
    text: String,
    time: {
        type: Date,
        default: Date.now()
    }
});

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
