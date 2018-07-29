const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "publish"],
        default: "draft",
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgs: [
        {
            type: String,
            required: true
        }
    ],
    disclosureAgreement: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        index: "2d",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bedRooms: {
        type: Number,
        required: true
    },
    bathRooms: {
        type: Number,
        required: true
    },
    yearBuilt: {
        type: Date,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now()
    },
    sqFeet: {
        type: Number,
        required: false
    },
    sqFeetLotSize: {
        type: Number,
        required: false
    },
    validProperty: {
        type: Boolean,
        default: true
    }
});

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
