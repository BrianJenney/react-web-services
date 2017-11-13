

const db = require("../models");

module.exports = {
    //upsert conversation
    post: function(req, res) {
    db.Messages.update(
      { id: req.body.id},
      {
         $set: { participants: [req.body.to, req.body.from] },
         $push: { messages: {
             from: req.body.from,
             to: req.body.to,
             text: req.body.text
             } 
         }
      },
      { upsert: true }
    )
    .then(doc=> res.json(doc))
    .catch(doc=>res.json(err));
    },

    //get messages for user
    getMessages: function(req, res){
      db.Messages.find({participants: req.params.email})
      .then(doc => res.json(doc))
      .catch(err => res.json(err));
    }

  };