

const router = require("express").Router();
const listingsController = require("../../controllers/listingsController");

router.route("/getlistings")
  .get(listingsController.getHomeListings);


module.exports = router;