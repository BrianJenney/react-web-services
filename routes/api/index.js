
const router    = require('express').Router()
const user      = require('./register')
const property  = require('./property')
const messages  = require('./message')
const listings  = require('./listings')

router.use('/user', user)
router.use('/property', property)
router.use('/messages', messages)
router.use('/listings', listings)

module.exports = router
