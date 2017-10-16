

const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/post")
  .post(messageController.post);

router.route("/getmessage")
  .get(messageController.getMessages);

module.exports = router;