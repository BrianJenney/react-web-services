const db = require("../models");
const ObjectId = require("mongodb").ObjectID;

//TODO:
//socket on post -- push message to DB -- send a receive socket to the recipient

module.exports = {
    //  upsert conversation
    post: (req, res) => {
        const { to, from, text } = req.body;
        db.Messages.findOneAndUpdate(
            { participants: [to, from] },
            {
                $set: { participants: [to, from] },
                $push: {
                    messages: {
                        from: from,
                        to: to,
                        text: text,
                        viewed: false
                    }
                }
            },
            { upsert: true }
        )
            .then(doc => {
                console.log({ doc });
                req.socket.emit("newMessage", { doc });
                res.json(doc);
            })
            .catch(err => res.json(err));
    },

    //set message to viewed
    viewMessage: async (req, res) => {
        db.Messages.update(
            { "messages._id": new ObjectId(req.body.messageId) },
            { $set: { "messages.$.viewed": true } }
        )
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    //  get messages for user
    getMessages: (req, res) => {
        db.Messages.find({ participants: req.params.email })
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    //  get a convo based on two users
    getConvo: (req, res) => {
        db.Messages.find({
            participants: { $all: [req.params.recipient, req.params.sender] }
        })
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    }
};
