

const db = require("../models");

module.exports = {
    //post message to pic based on pic id
    post: function(req, res) {
      db.Messages.create(req.body)
      .then(doc => res.json(doc))
      .catch(err => res.json(err));
    },

    //get messages based on pic id
    getMessages: function(req,res){
      db.Messages.find({id : req.body.id})
      .then(doc=> res.json(doc))
      .catch(doc=>res.json(err));
    }
  };