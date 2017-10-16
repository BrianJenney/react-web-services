
const router = require("express").Router();
const user = require("./register");
const pics = require("./pics");
const messages = require("./message");

router.use("/user", user);
router.use("/pics", pics);
router.use("/messages", messages);

module.exports = router;