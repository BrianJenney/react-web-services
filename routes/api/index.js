const router = require("express").Router();
const user = require("./register");
const property = require("./property");
const messages = require("./message");

router.use("/user", user);
router.use("/property", property);
router.use("/messages", messages);

module.exports = router;
