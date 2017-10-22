

const router = require("express").Router();
const messageController = require("../../controllers/messageController");

router.route("/postmessage")
  .post(messageController.post);

router.route("/getmessage")
  .get(messageController.getMessages);

  router.route("/getmessagesbyuser")
  .get(messageController.getMessagesByUser);

  router.route("/getconvofromlisting")
  .get(messageController.getConvoFromListing);


module.exports = router;