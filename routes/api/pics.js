const verify = require('../auth/authVerify.js')
const router = require('express').Router()
const picsController = require('../../controllers/picsController')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

router.route('/upload')
  .post(multipartMiddleware, picsController.upload)

router.route('/getlistings/:userid')
  .get(picsController.getListings)

router.route('/getlistingsbyuser/:email')
  .get(picsController.getListingsByUser)

router.route('/searchlistings')
  .post(picsController.searchListings)

module.exports = router
