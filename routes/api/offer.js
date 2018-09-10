const router = require("express").Router();
const offerController = require("../../controllers/offerController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.route("/getoffer/:home_id").get(offerController.getOffers);

router.route("/makeoffer").post(multipartMiddleware, offerController.makeOffer);

router.route("/offerinfo").post(offerController.getOffersByuser);

router.route("/getoffers").post(offerController.getOffers);

router.route("/submitoffer").post(offerController.submitOffer);

module.exports = router;
