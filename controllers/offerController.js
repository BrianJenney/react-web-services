const db = require("../models");
const axios = require("axios");
const cloudinary = require("cloudinary");
const ObjectId = require("mongodb").ObjectID;
const geoKey = process.env.NODE_ENV
    ? process.env.geoapi
    : require("../config.js").geoapi;
const Mailer = require("../mailer/mail");

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
        let imgUrl;
        if (req.files) {
            await cloudinary.uploader
                .upload(req.files.file.path, function(result, error) {
                    updateOfferAgreement(req.body, result.url, res);
                })
                .catch(error => {
                    handleError(error, res);
                });
        } else {
            updateOfferPrice(req.body, res);
        }
    },

    //TODO: check if offer can be submitted

    // SUBMIT OFFER
    submitOffer: async (req, res) => {
        const home = await db.Property.find({
            _id: new ObjectId(req.body.homeId)
        });
        const recipient = await db.User.find({
            _id: ObjectId(home[0].userid)
        });
        const sender = await db.User.find({
            _id: ObjectId(req.body.userId)
        });

        db.Offer.update(
            { userId: new ObjectId(req.body.userId), homeId: home._id },
            {
                $set: { readyToSend: true }
            },
            { upsert: true }
        )
            .then(() => {
                const mailer = new Mailer(
                    recipient[0].email,
                    sender[0].email,
                    "Offer",
                    "<h1>Test</h1>",
                    res
                );
                mailer.sendMail();
            })
            .catch(err => res.json(err));
    },

    // GET ALL OFFERS BELONGING TO A SELLER
    getOffers: async (req, res) => {
        const homes = await db.Property.find({
            userid: req.body.userId
        });

        const homeIds = homes.map(home => {
            return `${home._id}`;
        });

        db.Offer.aggregate([
            {
                $match: {
                    homeId: {
                        $in: homeIds
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            }
        ])
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // GET OFFER INFO BY USER AND HOME
    getOffersByuser: (req, res) => {
        db.Offer.find({
            homeId: req.body.homeId,
            userId: req.body.userId
        })
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    }
};

//private

function updateOfferPrice(obj, res) {
    db.Offer.update(
        { homeId: obj.homeId, userId: ObjectId(obj.userId) },
        {
            $set: { ...obj }
        },
        { upsert: true }
    )
        .then(doc => res.json(doc))
        .catch(err => res.json(err));
}

function updateOfferAgreement(obj, img, res) {
    db.Offer.update(
        { homeId: obj.homeId, userId: obj.userId },
        {
            $set: {
                purchaseAgreement: img,
                homeId: obj.homeId,
                userId: obj.userId
            }
        },
        { upsert: true }
    )
        .then(doc => res.json(doc))
        .catch(err => res.json(err));
}

function handleError(e, res) {
    res.json(e);
}
