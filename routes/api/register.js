const router = require("express").Router();
const userController = require("../../controllers/userController");

router.route("/login").post(userController.login);

router.route("/register").post(userController.register);

router.route("/profile").post(userController.updateProfile);

module.exports = router;
