

const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/postmessage")
  .get(messageController.post);

router.route("/getmessage")
  .get(messageController.getMessages);

router.route("/getmessagesbyuser")
  .get(messageController.getMessagesByUser);

router.route("/getconvofromlisting")
  .get(messageController.getConvoFromListing);

router.route("/getusersbypic")
  .get(messageController.getUsersByPic);


module.exports = router;