const db = require("../models");

module.exports = {
    upload: function(req, res) {
      db.Pics.create(req.body)
      .then(doc => res.json(doc))
      .catch(err => res.json(err));
    },

    getListings: function(req,res){
      db.Pics.find({'userid': {$ne: req.query.picid} })
      .then(doc=> res.json(doc)) 
      .catch(doc=>res.json(err));
    }
  };