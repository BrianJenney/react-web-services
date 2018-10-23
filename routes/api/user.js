const router = require("express").Router();
const userController = require("../../controllers/userController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.route("/login").post(userController.login);

router.route("/register").post(userController.register);

router.route("/user/:id").get(userController.userInfo);

router
    .route("/profile")
    .post(multipartMiddleware, userController.updateProfile);

module.exports = router;
