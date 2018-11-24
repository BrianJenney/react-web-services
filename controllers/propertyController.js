const db = require("../models");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
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
    //  UPLOAD HOUSING DATA
    upload: async (req, res) => {
        let imgUrl = [],
            promises = [];

        req.files.file.map(file => {
            promises.push(
                cloudinary.uploader.upload(
                    file.path,
                    { resource_type: "auto" },
                    function(result) {
                        imgUrl.push(result.url);
                    }
                )
            );
        });

        Promise.all(promises).then(() => {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${
                        req.body.address
                    }&key=${geoKey}`
                )
                .then(resp => {
                    req.body.location = [
                        resp.data.results[0].geometry.location.lng,
                        resp.data.results[0].geometry.location.lat
                    ];
                    req.body.imgs = imgUrl;
                })
                .then(() => {
                    if (Object.keys(req.body).length === 0) {
                        return;
                    }
                    db.Property.create(req.body)
                        .then(doc => res.json(doc))
                        .catch(err => res.json(err));
                });
        });
    },

    //  GET ALL LISTINGS
    getListings: (req, res) => {
        db.Property.find({})
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    //  LISTINGS BY USER
    getListingsByUser: async (req, res) => {
        const user = await db.User.find({ email: req.params.email });

        db.Property.find({ userid: user[0]._id })
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // UPLOAD PROPERTY DISCLOSURE
    uploadDisclosure: async (req, res) => {
        let imgUrl;
        const user = await db.User.findOne({ email: req.body.userEmail });

        await cloudinary.uploader.upload(req.files.file.path, result => {
            imgUrl = result.url;
        });

        db.Property.findOneAndUpdate(
            { userid: user._id },
            {
                $set: {
                    disclosureAgreement: imgUrl
                }
            },
            { new: true }
        )
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    },

    // LISTING BY ID OR EMAIL
    houseInfo: async (req, res) => {
        let owner;
        const isEmail = req.params.id.includes("@");

        if (isEmail) {
            owner = await db.User.findOne({ email: req.params.id });
        }

        const query = isEmail
            ? { userid: owner._id }
            : { _id: new ObjectId(req.params.id) };

        const doc = await db.Property.findOne(query);

        const monthly = doc.length ? getMortgage(doc.price) : 0;
        const user = doc.length ? await getUserEmail(doc.userid) : [];

        res.json({
            doc,
            monthly,
            user: user
        });
    },

    //  SEARCH LISTINGS
    searchListings: async (req, res) => {
        let conditions = {};
        let lon, lat, andClauses, params;

        params = JSON.parse(JSON.stringify(req.body));

        andClauses = await buildQuery(params);
        let {
            maxPrice,
            minPrice,
            address,
            bedRooms,
            bathRooms,
            propertyType,
            ...whereClause
        } = params;

        for (const prop in whereClause) {
            let query = {};
            query[prop] = whereClause[prop];
            andClauses.push(query);
        }

        conditions["$and"] = andClauses;

        db.Property.find(conditions)
            .then(doc => res.json(doc))
            .catch(err => res.json(err));
    }
};

//private

buildQuery = async params => {
    let andClauses = [];

    if (params.hasOwnProperty("address") && params.address !== null) {
        await getLonLat(params.address).then((resp, err) => {
            if (err) {
                throw err;
            }

            [lon, lat] = [
                resp.data.results[0].geometry.location.lng,
                resp.data.results[0].geometry.location.lat
            ];
        });
        andClauses.push({
            location: { $near: [lon, lat], $maxDistance: 0.25 }
        });
    }
    if (params.hasOwnProperty("bedRooms")) {
        andClauses.push({ bedRooms: { $gte: params.bedRooms || 0 } });
    }

    if (params.hasOwnProperty("bathRooms")) {
        andClauses.push({ bathRooms: { $gte: params.bathRooms || 0 } });
    }

    if (
        params.hasOwnProperty("maxPrice") &&
        params.hasOwnProperty("minPrice")
    ) {
        andClauses.push({
            price: {
                $gt: params.minPrice || 0,
                $lt: params.maxPrice || 1000000
            }
        });
    }

    if (params.hasOwnProperty("propertyType")) {
        if (params.propertyType !== null) {
            andClauses.push({ propertyType: params.propertyType });
        }
    }

    return andClauses;
};

getLonLat = address => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoKey}`
    );
};

getUserEmail = userId => {
    return db.User.find({ _id: new ObjectId(userId) });
};

getMortgage = price => {
    const principle = price - price * 0.2;
    const interest = 3.5 / 100 / 12; //monthly interest rate
    const numberOfPayments = 30 * 12; //number of payments months
    //monthly mortgage payment
    return monthlyPayment(principle, numberOfPayments, interest);
};

function monthlyPayment(principle, numberOfPayments, interest) {
    return Math.round(
        principle *
            interest *
            Math.pow(1 + interest, numberOfPayments) /
            (Math.pow(1 + interest, numberOfPayments) - 1)
    );
}
