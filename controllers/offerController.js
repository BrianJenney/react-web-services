const db = require("../models");
const axios = require("axios");
const cloudinary = require("cloudinary");
const ObjectId = require("mongodb").ObjectID;
const geoKey = process.env.NODE_ENV
    ? process.env.geoapi
    : require("../config.js").geoapi;

cloudinary.config({
    cloud_name: process.env.NODE_ENV
        ? process.env.cloduinary_cloud
        : require("../config.js").cloduinary_cloud,
    api_key: process.env.NODE_ENV
        ? process.env.cloudinary
        : require("../config.js").cloudinary,
    api_secret: process.env.NODE_ENV
        ? process.env.cloudinary_secret
        : require("../config.js").cloudinary_secret
});

module.exports = {
    //CREATE AN OFFER
    makeOffer: async (req, res) => {
        db.Offer.update(
            { homeId: req.body.homeId, userId: req.body.userId },
            {
                $set: { ...req.body }
            },
            { upsert: true }
        )
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // GET ALL OFFERS FOR A HOME
    getOffers: async (req, res) => {
        db.Offer.where({
            homeId: req.body.homeId
        })
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    }
};
