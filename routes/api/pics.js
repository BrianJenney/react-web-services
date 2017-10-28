
const router = require("express").Router();
const picsController = require("../../controllers/picsController");

router.route("/upload")
  .post(picsController.upload);

router.route("/getlistings")
  .get(picsController.getListings);

router.route("/getlistingsbyuser")
  .get(picsController.getListingsByUser);

module.exports = router;