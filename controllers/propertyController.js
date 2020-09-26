const db = require('../models');
const axios = require('axios');
const cloudinary = require('cloudinary');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const geoKey = process.env.geoapi;
cloudinary.config({
    cloud_name: process.env.cloduinary_cloud,
    api_key: process.env.cloudinary,
    api_secret: process.env.cloudinary_secret,
});
require('dotenv').config();

const DOCUMENT_ENUM = [
    'transferDisclosure',
    'leadPaintDisclosure',
    'naturalHazardDisclosure',
    'sellerQuestionaire',
    'statewideAdvisory',
    'supplementalQuestionaire',
];

const _getAddress = async (address) => {
    const addressResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoKey}`
    );
    return addressResponse;
};

//  UPLOAD A PROPERTY
const createProperty = async (req, res) => {
    let imgUrl = [],
        promises = [];

    req.files.file.map((file) => {
        promises.push(
            cloudinary.uploader.upload(file.path, (result) => {
                imgUrl.push(result.url);
            })
        );
    });
    const addressResponse = await _getAddress(req.body.address);
    Promise.all(promises).then(() => {
        req.body.location = [
            addressResponse.data.results[0].geometry.location.lng,
            addressResponse.data.results[0].geometry.location.lat,
        ];
        req.body.imgs = imgUrl;
        if (Object.keys(req.body).length === 0) {
            return;
        }
        const userId = new ObjectId(req.body.userId);

        db.Property.create(req.body)
            .then((doc) => res.json(doc))
            .catch((err) => res.json(err));
    });
};

//EDIT A PROPERTY
const editProperty = async (req, res) => {
    const {
        address,
        homeId,
        imgsToDelete,
        email,
        userId,
        price,
        propertyType,
        description,
        bedRooms,
        bathRooms,
        yearBuilt,
        sqFeetLot,
        sqFeet,
    } = req.body;

    const home = await db.Property.findOne({
        _id: new ObjectId(homeId),
    });
    const currentImages = home.imgs;
    const addressResponse = await _getAddress(address);

    let newImages = currentImages.filter((img) => {
        return !(imgsToDelete || []).includes(img);
    });

    let imgUrls = [],
        promises = [];

    const hasFile = Object.keys(req.files).length;

    if (hasFile) {
        const files = req.files.file.isArray
            ? req.files.file
            : [req.files.file];
        files.map((file) => {
            promises.push(
                cloudinary.uploader.upload(file.path, (result) => {
                    imgUrls.push(result.url);
                })
            );
        });
    }

    await Promise.all(promises).then(() => {
        db.Property.findOneAndUpdate(
            {
                _id: new ObjectId(homeId),
            },
            {
                $set: {
                    imgs: [...newImages, ...imgUrls],
                    location: [
                        addressResponse.data.results[0].geometry.location.lng,
                        addressResponse.data.results[0].geometry.location.lat,
                    ],
                    address,
                    price,
                    propertyType,
                    description,
                    bedRooms,
                    bathRooms,
                    yearBuilt,
                    sqFeetLot,
                    sqFeet,
                },
            },
            {
                new: true,
            }
        )
            .then((doc) => res.json(doc))
            .catch((err) => res.json(err));
    });
};

// TODO: we should not let people get all listings
//  GET ALL LISTINGS
const getListings = (req, res) => {
    db.Property.find({})
        .then((doc) => res.json(doc))
        .catch((err) => res.json(err));
};

//  LISTINGS BY USER
const getListingsByUser = async (req, res) => {
    const user = await db.User.find({
        email: req.params.email,
    });

    db.Property.find({
        userId: user[0]._id,
    })
        .then((doc) => res.json(doc))
        .catch((err) => res.json(err));
};

// UPLOAD DOCUMENTS TO SELL PROPERTY
const uploadDocument = async (req, res) => {
    const { documentType, userEmail } = req.body;
    let imgUrl;
    const user = await db.User.findOne({
        email: userEmail,
    });

    if (DOCUMENT_ENUM.includes(documentType)) {
        await cloudinary.uploader.upload(
            req.files.file.path,
            {
                flags: `attachment:${documentType}`,
            },
            (result) => {
                imgUrl = result.url;
            }
        );

        db.Property.findOneAndUpdate(
            { userId: user._id },
            {
                $set: { [documentType]: imgUrl },
            },
            { new: true }
        )
            .then((doc) => res.json(doc))
            .catch((err) => res.json(err));
    } else {
        res.json({
            error: 'file type not supported',
        });
    }
};

// LISTING BY ID OR EMAIL
const houseInfo = async (req, res) => {
    let owner;
    const isEmail = req.params.id.includes('@');

    if (isEmail) {
        owner = await db.User.findOne({
            email: req.params.id,
        });
    }

    const query = isEmail
        ? { userId: owner._id }
        : { _id: new ObjectId(req.params.id) };

    const doc = await db.Property.findOne(query);

    const monthly = doc ? getMortgage(doc.price) : 0;
    const user = doc ? await getUserEmail(doc.userId) : [];

    res.json({
        doc,
        monthly,
        user: user,
    });
};

//  SEARCH LISTINGS
const searchListings = async (req, res) => {
    let conditions = {};
    let lon, lat, andClauses, params;

    const { body } = req;
    params = body;

    if (_.isEmpty(body)) {
        return res.json([]);
    }

    if (Number.isNaN(Number(params.maxPrice))) {
        params.maxPrice = 0;
    }

    andClauses = await _buildQuery(params);
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

    conditions['$and'] = andClauses;

    db.Property.find(conditions)
        .then((doc) => res.json(doc))
        .catch((err) => res.json(err));
};

const getFavoritedProperties = async (req, res) => {
    const {
        body: { userId },
    } = req;

    db.Property.find({
        likes: [userId],
    })
        .then((doc) => res.json(doc))
        .catch((err) => res.json(err));
};

_buildQuery = async (params) => {
    let andClauses = [];

    if (_.has(params, 'address') && params.address !== null) {
        await _getLonLat(params.address).then((resp, err) => {
            if (err) {
                throw err;
            }

            [lon, lat] = [
                resp.data.results[0].geometry.location.lng,
                resp.data.results[0].geometry.location.lat,
            ];
        });
        andClauses.push({
            location: {
                $near: [lon, lat],
                $maxDistance: 0.25,
            },
        });
    }
    if (_.has(params, 'bedRooms')) {
        andClauses.push({
            bedRooms: {
                $gte: params.bedRooms || 0,
            },
        });
    }

    if (_.has(params, 'bathRooms')) {
        andClauses.push({
            bathRooms: {
                $gte: params.bathRooms || 0,
            },
        });
    }

    if (_.has(params, 'maxPrice') && _.has(params, 'minPrice')) {
        andClauses.push({
            price: {
                $gt: params.minPrice || 0,
                $lt: params.maxPrice || 1000000,
            },
        });
    }

    if (_.has(params, 'propertyType')) {
        if (params.propertyType !== null && params.propertyType.length) {
            andClauses.push({
                propertyType: params.propertyType,
            });
        }
    }

    return andClauses;
};

const _getLonLat = (address) => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoKey}`
    );
};

module.exports = {
    createProperty,
    editProperty,
    getListings,
    getListingsByUser,
    uploadDocument,
    houseInfo,
    searchListings,
    getFavoritedProperties,
};
