const db = require("../models");
const ObjectId = require("mongodb").ObjectID;

module.exports = {
    //  upsert conversation
    post: (req, res) => {
        db.Messages.update(
            { id: req.body.id },
            {
                $set: { participants: [req.body.to, req.body.from] },
                $push: {
                    messages: {
                        from: req.body.from,
                        to: req.body.to,
                        text: req.body.text,
                        viewed: false
                    }
                }
            },
            { upsert: true }
        )
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    //set message to viewed
    viewMessage: async (req, res) => {
        db.Messages.update(
            { "messages._id": ObjectId(req.body.messageId) },
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
