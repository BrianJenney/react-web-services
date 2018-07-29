const verify = require("../auth/authVerify.js");
const router = require("express").Router();
const propertyController = require("../../controllers/propertyController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.route("/upload").post(multipartMiddleware, propertyController.upload);

router.route("/getlistings/:userid").get(propertyController.getListings);

router
    .route("/getlistingsbyuser/:email")
    .get(propertyController.getListingsByUser);

router.route("/searchlistings").post(propertyController.searchListings);

router.route("/info/:id").get(propertyController.houseInfo);

router
    .route("/disclosure")
    .post(multipartMiddleware, propertyController.uploadDisclosure);

module.exports = router;
