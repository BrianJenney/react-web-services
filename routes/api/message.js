const verify = require('../auth/authVerify.js');
const router = require('express').Router();
const messageController = require('../../controllers/messageController');

router.route('/postmessage').post(verify, messageController.postMessage);

router.route('/getmessages/:email').get(verify, messageController.getMessages);

router.route('/getconvo/:recipient/:sender').get(verify, messageController.getConvo);

router.route('/viewmessage').post(messageController.viewMessage);

router.route('/messageviewed').post(messageController.viewMessage);

module.exports = router;
