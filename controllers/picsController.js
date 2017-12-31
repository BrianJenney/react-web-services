const db = require("../models");
const keys = require("../config.js");
const axios = require("axios");

module.exports = {
    upload: function(req, res) {

      let address = `${req.body.address} ${req.body.city}, ${req.body.state}, ${req.body.zipCode}`;

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keys.geoapi}`).then((resp)=>{
        req.body.location = [resp.data.results[0].geometry.location.lng, resp.data.results[0].geometry.location.lat];
      }).then(()=>{
        if(Object.keys(req.body).length === 0){return}
        db.Pics.create(req.body)
        .then(doc => res.json(doc))
        .catch(err => res.json(err));
      }) 
    },

    //find all houses except the ones by the current user 
    //should we show those too?
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