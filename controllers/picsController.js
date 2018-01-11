const db = require("../models");
const keys = require("../config.js");
const axios = require("axios");
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: keys.cloduinary_cloud,
  api_key: keys.cloudinary,
  api_secret: keys.cloudinary_secret
});

module.exports = {
    upload: ((req, res) => {
      let imgUrl, promise;

      promise = cloudinary.uploader.upload(req.files.imgUrl.path, function(result) {
        imgUrl = result.url;
      });

      let address = `${req.body.address} ${req.body.city}, ${req.body.state}, ${req.body.zipCode}`;

      promise.then(() => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keys.geoapi}`).then((resp)=>{
          req.body.location = [resp.data.results[0].geometry.location.lng, resp.data.results[0].geometry.location.lat];
          req.body.imgUrl = [imgUrl];
        }).then(()=>{
          if(Object.keys(req.body).length === 0){return}
          db.Pics.create(req.body)
          .then(doc => res.json(doc))
          .catch(err => res.json(err));
        }) 
      }); 
    }),

    //find all houses except the ones by the current user 
    //should we show those too?
    getListings: ((req,res) => {
      db.Pics.find({'userid': {$ne: req.params.userid} })
      .then(doc=> res.json(doc)) 
      .catch(doc=>res.json(err));
    }),

    getListingsByUser: ((req, res) => {
      db.Pics.find({'userEmail': req.params.email})
      .then(doc=>res.json(doc))
      .catch(doc=>res.json(err));
    }),

    //https://stackoverflow.com/questions/39986639/dynamic-query-mongodb
    searchListings: ((req, res) => {

    })
  };