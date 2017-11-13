

const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/postmessage")
  .post(messageController.post);

router.route("/getmessages/:email")
  .get(messageController.getMessages);

router.route("/getconvo/:recipient/:sender")
  .get(messageController.getConvo);


module.exports = router;