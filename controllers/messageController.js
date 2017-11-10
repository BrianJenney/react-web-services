

const db = require("../models");

module.exports = {
    //upsert conversation
    post: function(req, res) {
    console.log(req);
    db.Messages.update(
      { id: 1},
      {
         $set: { participants: ["bob","jane"] },
         $push: { messages: {
             from: 'me',
             to: 'you',
             text: 'this is some text'
             } 
         }
      },
      { upsert: true }
    )
    .then(doc=> res.json(doc))
    .catch(doc=>res.json(err));
    },

    //get messages based on pic id
    getMessages: function(req,res){
      db.Messages.aggregate({id : req.query.id, user: '$user'})
      .then(doc=> res.json(doc))
      .catch(doc=>res.json(err));
    },
    //get messages for a user for a particular picture
    getMessagesByUser: function(req, res){
      db.Messages.find({user: req.query.email, id: req.query.id})
      .then(doc=> res.json(doc))
      .catch(doc=> res.json(err));
    },
    //get number of users commenting on a specific pic
    getUsersByPic: function(req, res){
      db.Messages.aggregate(
          {"$match":{id: req.query.id}}, 
          {"$group":{"_id":"$user", text: {$push: '$text'} }} 
        )
        .then(doc=>res.json(doc))
        .catch(doc=>res.json(err));
    },
    //get convo between users about a pic - from listings
    getConvoFromListing: function(req, res){
      db.Messages.find({
      $or: [{to: req.query.recipient}, {from: req.query.recipient}]
     }).sort({time: 1 })
     .then(doc=>res.json(doc))
     .catch(doc=>res.json(doc));
    }
  };