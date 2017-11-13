
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    participants: [String],
    id: String,//id of the house pic
    messages: [
        {
            from: String,
            to: String,
            text: String,
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ]
    
});

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
