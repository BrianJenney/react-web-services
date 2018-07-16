const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    participants: [String],
    id: String,
    messages: [
        {
            from: String,
            to: String,
            text: String,
            time: {
                type: Date,
                default: Date.now()
            },
            viewed: {
                type: Boolean,
                default: false
            }
        }
    ]
});

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
