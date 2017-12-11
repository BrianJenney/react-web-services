
const verify = require("../auth/authVerify.js");
const router = require("express").Router();
const listingsController = require("../../controllers/listingsController");

router.route("/getlistings")
  .get(verify, listingsController.getHomeListings);


module.exports = router;