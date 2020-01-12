const db = require("../models");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const ObjectId = require("mongodb").ObjectID;
const geoKey = process.env.geoapi;
const Mailer = require("../mailer/mail");
cloudinary.config({
    cloud_name: process.env.cloduinary_cloud,
    api_key: process.env.cloudinary,
    api_secret: process.env.cloudinary_secret
});
require('dotenv').config();

const NECESSARY_DOCS = ["purchaseAgreement", "loanDocument"];

module.exports = {
    //CREATE AN OFFER
    makeOffer: async (req, res) => {
        let imgUrl;
        if (req.files) {
            await cloudinary.uploader
                .upload(req.files.file.path, (error, result) => {
                    const { homeId, userId, documentType } = req.body;
                    const updateObj = {
                        [documentType]: result.url,
                        homeId: new ObjectId(homeId),
                        userId: new ObjectId(userId)
                    };

                    if (documentType === "sellerPurchaseAgreement") {
                        sendSellerSignedPurchaseAgreementMail(updateObj);
                    }

                    updateOffer(updateObj, res);
                })
                .catch(error => {
                    handleError(error, res);
                });
        } else {
            updateOffer(
                {
                    homeId: new ObjectId(req.body.homeId),
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
        const home = await db.Property.findOne({
            _id: new ObjectId(req.body.homeId)
        });
        const recipient = await db.User.findOne({
            _id: new ObjectId(home.userd)
        });
        const sender = await db.User.findOne({
            _id: new ObjectId(req.body.userId)
        });

        const offer = await db.Offer.findOne({
            userId: new ObjectId(req.body.userId),
            homeId: home._id
        });

        if (offer && offer.readyToSend) {
            res.json({ message: "offer already sent" });
        } else {
            db.Offer.update(
                {
                    userId: new ObjectId(req.body.userId),
                    homeId: new ObjectId(req.body.homeId)
                },
                {
                    $set: { readyToSend: true }
                },
                { upsert: true }
            )
                .then(() => {
                    const mailer = new Mailer(
                        recipient.email,
                        sender.email,
                        "Offer",
                        `<p>You have an offer on from ${
                        sender.email
                        } on your property.</p> 
                        <p>Visit your <a href='localhost:3000/dashboard'>dashboard</a> to review this offer.</p>`
                    );
                    mailer.sendMail();
                    res.json({ ok: 200 });
                })
                .catch(err => res.json(err));
        }
    },

    //SELLER ACCEPT OFFER
    acceptOffer: async (req, res) => {
        const offer = req.body;

        const recipient = await db.User.findOne({
            _id: new ObjectId(offer.userId)
        });

        const home = await db.Property.findOne({
            _id: new ObjectId(offer.homeId)
        });

        const offersForHome = await db.Offer.find({
            homeId: new ObjectId(offer.homeId)
        });

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
                    homeId: new ObjectId(offer.homeId),
                    userId: new ObjectId(offer.userId),
                    accepted: true,
                    acceptedDate: Date.now()
                },
                res
            );

            const sender = await db.User.find({
                _id: new ObjectId(home.userId)
            });

            const mailer = new Mailer(
                recipient.email,
                sender.email,
                "Offer Accepted",
                `<p>Your offer on the property, ${
                home.address
                } has been accepted!</p> 
                    <p>Visit TBD <a href='localhost:3000/dashboard'>dashboard</a> for the next steps.</p>`,
                res
            );
            mailer.sendMail();
        }
    },

    // BUYER ACCEPT OFFER
    buyerAcceptOffer: async (req, res) => {
        const { offerId } = req.body;

        const offer = await db.Offer.findById(offerId);

        offer.buyerAcceptance = true;

        offer
            .save()
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // GET ALL OFFERS BELONGING TO A SELLER
    getOffers: async (req, res) => {
        const homes = await db.Property.find({
            userId: new ObjectId(req.body.userId)
        });

        const homeIds = homes.map(home => {
            return new ObjectId(`${home._id}`);
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
    getOffersByUserAndHome: async (req, res) => {
        db.Offer.aggregate([
            {
                $match: {
                    homeId: new ObjectId(req.body.homeId),
                    userId: new ObjectId(req.body.userId)
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

    // GET OFFER INFO BY USER
    getOffersByUser: (req, res) => {
        db.Offer.aggregate([
            {
                $match: {
                    userId: new ObjectId(req.params.user_id)
                }
            },
            {
                $lookup: {
                    from: "properties",
                    localField: "homeId",
                    foreignField: "_id",
                    as: "home"
                }
            },
            {
                $unwind: "$home"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "seller"
                }
            }
        ])
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // GET OFFER INFO BY ID WITH HOUSE
    offerInfo: async (req, res) => {
        const offer = await db.Offer.findOne({
            _id: new ObjectId(req.params.offer_id)
        });

        const home = await db.Property.findOne({
            _id: new ObjectId(offer.homeId)
        });

        res.json({ offer, home });
    }
};

//private
const _doesOfferHaveNeededDocs = offer => {
    return NECESSARY_DOCS.every(doc => offer.includes(doc));
};

async function updateOffer(obj, res) {
    db.Offer.findOneAndUpdate(
        { homeId: obj.homeId, userId: new ObjectId(obj.userId) },
        {
            $set: { ...obj }
        },
        { upsert: true, new: true }
    )
        .then(doc => {
            res.json(doc);
        })
        .catch(err => res.json(err));
}

//TODO: use the prod url when in a prod environment

async function sendSellerSignedPurchaseAgreementMail(offer) {
    const recipient = await db.User.findOne({
        _id: new ObjectId(offer.userId)
    });

    const home = await db.Property.findOne({
        _id: new ObjectId(offer.homeId)
    });

    const sender = await db.User.find({
        _id: new ObjectId(home.userId)
    });

    const mailer = new Mailer(
        recipient.email,
        sender.email,
        "Purchase Agreement Signed",
        `<p>The seller ${
        sender.firstName
        } has signed your purchase agreement!</p> 
        <p>Visit your <a href='localhost:3000/buyerdashboard/${
        home._id
        }'>dashboard</a> for the next steps.</p>`
    );
    mailer.sendMail();
}

function handleError(e, res) {
    res.json(e);
}
