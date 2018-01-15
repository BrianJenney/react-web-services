const router = require('express').Router()
const userController = require('../../controllers/userController')

router.route('/login')
  .post(userController.login)

router.route('/register')
  .post(userController.register)

router.route('/authenticate/:token')
  .post(userController.authenticate)

module.exports = router
