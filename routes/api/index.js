
const router = require('express').Router()
const user = require('./register')
const pics = require('./pics')
const messages = require('./message')
const listings = require('./listings')

router.use('/user', user)
router.use('/pics', pics)
router.use('/messages', messages)
router.use('/listings', listings)

module.exports = router
