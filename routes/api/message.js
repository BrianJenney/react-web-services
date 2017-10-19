

const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/postmessage")
  .post(messageController.post);

router.route("/getmessage")
  .get(messageController.getMessages);

module.exports = router;