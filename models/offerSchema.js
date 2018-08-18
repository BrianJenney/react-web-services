const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    purchaseAgreement: {
        type: String,
        required: false
    },
    loanDocument: {
        type: String,
        required: false
    },
    offer: {
        type: Number,
        required: false
    },
    homeId: {
        type: String,
        required: true
    },
    additionalDocs: [
        {
            type: String,
            required: false
        }
    ]
});

const Offer = mongoose.model("Offer", OfferSchema);

module.exports = Offer;
