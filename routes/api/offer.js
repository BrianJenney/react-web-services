const router = require("express").Router();
const offerController = require("../../controllers/offerController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.route("/getoffer/:home_id").get(offerController.getOffers);

router.route("/makeoffer").post(offerController.makeOffer);

module.exports = router;
