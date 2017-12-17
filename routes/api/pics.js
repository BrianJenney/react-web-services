const verify = require("../auth/authVerify.js");
const router = require("express").Router();
const picsController = require("../../controllers/picsController");

router.route("/upload")
  .post(verify, picsController.upload);

router.route("/getlistings/:userid")
  .get(verify, picsController.getListings);

router.route("/getlistingsbyuser/:email")
  .get(verify, picsController.getListingsByUser);

module.exports = router;