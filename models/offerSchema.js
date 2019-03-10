const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
    supportingDocument: {
        type: String,
        required: false
    },
    offer: {
        type: Number,
        required: false
    },
    homeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    additionalDocs: [
        {
            type: String,
            required: false
        }
    ],
    readyToSend: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    accepted: {
        type: Boolean,
        default: false
    },
    acceptedDate: {
        type: Date
    },
    sellerPurchaseAgreement: {
        type: String
    },
    buyerAcceptance: {
        type: Boolean,
        default: false
    }
});

const Offer = mongoose.model("Offer", OfferSchema);

module.exports = Offer;
