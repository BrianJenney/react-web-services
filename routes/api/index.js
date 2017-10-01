
const router = require("express").Router();
const user = require("./register");
const pics = require("./pics")

router.use("/user", user);
router.use("/pics", pics);

module.exports = router;