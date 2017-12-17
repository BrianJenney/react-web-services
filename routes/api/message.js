
const verify = require("../auth/authVerify.js");
const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/postmessage")
  .post(verify, messageController.post);

router.route("/getmessages/:email")
  .get(verify, messageController.getMessages);

router.route("/getconvo/:recipient/:sender")
  .get(verify, messageController.getConvo);


module.exports = router;