
const router = require("express").Router();
const picsController = require("../../controllers/picsController");

router.route("/upload")
  .post(picsController.upload);

router.route("/getlistings/:userid")
  .get(picsController.getListings);

router.route("/getlistingsbyuser/:email")
  .get(picsController.getListingsByUser);

module.exports = router;