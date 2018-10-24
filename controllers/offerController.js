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
                    const isPurchaseDoc = req.body.isPurchaseDoc === "true";

                    const typeOfFile = isPurchaseDoc
                        ? "purchaseAgreement"
                        : "loanDocument";

                    const updateObj = {
                        [typeOfFile]: result.url,
                        homeId: req.body.homeId,
                        userId: new ObjectId(req.body.userId)
                    };

                    updateOffer(updateObj, res);
                })
                .catch(error => {
                    handleError(error, res);
                });
        } else {
            updateOffer(
                {
                    homeId: req.body.homeId,
                    userId: new ObjectId(req.body.userId),
                    offer: req.body.offer
                },
                res
            );
        }
    },

    //TODO: check if offer can be submitted (needs purchase doc and loan doc)

    // SUBMIT OFFER
    submitOffer: async (req, res) => {
        const home = await db.Property.find({
            _id: new ObjectId(req.body.homeId)
        });
        const recipient = await db.User.find({
            _id: new ObjectId(home[0].userid)
        });
        const sender = await db.User.find({
            _id: new ObjectId(req.body.userId)
        });

        const offer = await db.Offer.find({
            userId: new ObjectId(req.body.userId),
            homeId: home[0]._id
        });

        if (offer.length && offer[0].readyToSend) {
            res.json({ message: "offer already sent" });
        } else {
            db.Offer.update(
                {
                    userId: new ObjectId(req.body.userId),
                    homeId: req.body.homeId
                },
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
                        `<p>You have an offer on from ${
                            sender[0].email
                        } on your property.</p> 
                        <p>Visit your <a href='localhost:3000/dashboard'>dashboard</a> to review this offer.</p>`,
                        res
                    );
                    mailer.sendMail();
                })
                .catch(err => res.json(err));
        }
    },

    //ACCEPT OFFER
    acceptOffer: async (req, res) => {
        const offer = req.body;

        const recipient = await db.User.find({
            _id: new ObjectId(offer.userId)
        });

        const home = await db.Property.find({
            _id: new ObjectId(offer.homeId)
        });

        const offersForHome = await db.Offer.find({ homeId: offer.homeId });

        const hasOffer = offersForHome
            .map(offer => {
                if ("accepted" in offer) {
                    return offer.accepted;
                } else {
                    return false;
                }
            })
            .includes(true);

        if (hasOffer) {
            res.json({ message: "offer already accepted" });
        } else {
            updateOffer(
                {
                    homeId: offer.homeId,
                    userId: new ObjectId(offer.userId),
                    accepted: true,
                    acceptedDate: Date.now()
                },
                res
            );

            const sender = await db.User.find({
                _id: new ObjectId(home[0].userid)
            });

            const mailer = new Mailer(
                recipient[0].email,
                sender[0].email,
                "Offer Accepted",
                `<p>Your offer on the property, ${
                    home[0].address
                } has been accepted!</p> 
                    <p>Visit TBD <a href='localhost:3000/dashboard'>dashboard</a> for the next steps.</p>`,
                res
            );
            mailer.sendMail();
        }
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

function updateOffer(obj, res) {
    db.Offer.findOneAndUpdate(
        { homeId: obj.homeId, userId: new ObjectId(obj.userId) },
        {
            $set: { ...obj }
        },
        { upsert: true, new: true }
    )
        .then(doc => res.json(doc))
        .catch(err => res.json(err));
}

function handleError(e, res) {
    res.json(e);
}
