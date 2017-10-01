const router = require("express").Router();
const userController = require("../../controllers/userController");

router.route("/login")
  .post(userController.login);

router.route("/registeruser")
  .post(userController.register);

module.exports = router;

