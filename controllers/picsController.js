const db = require("../models");

module.exports = {
    upload: function(req, res) {
      db.Pics.create(req.body)
      .then(doc => res.json(doc))
      .catch(err => res.json(err));
    },

    getListings: function(req,res){
      db.Pics.find({'userid': {$ne: req.params.userid} })
      .then(doc=> res.json(doc)) 
      .catch(doc=>res.json(err));
    },

    getListingsByUser: function(req, res){
      db.Pics.find({'userEmail': req.params.email})
      .then(doc=>res.json(doc))
      .catch(doc=>res.json(err));
    }
  };