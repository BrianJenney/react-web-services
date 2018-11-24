const router = require("express").Router();
const user = require("./user");
const property = require("./property");
const messages = require("./message");
const offers = require("./offer");

router.use("/user", user);
router.use("/property", property);
router.use("/messages", messages);
router.use("/offers", offers);

module.exports = router;
