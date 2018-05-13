const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  timeFrame: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  // TODO: what is status?

  // status: {
  //   type: String,
  //   required: true
  // },
  propertyType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imgs: [{
    type: String,
    required: true
  }],
  address: {
    type: String,
    required: true
  },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bedRooms: {
    type: Number,
    required: true
  },
  bathRooms: {
    type: Number,
    required: true
  },
  yearBuilt: {
    type: Date,
    required: true
  },
  datePosted: {
    type: Date,
    default: Date.now()
  },
  parkingSpaces: {
    type: Number,
    required: false
  },
  sqFeet: {
    type: Number,
    required: false
  },
  validProperty: {
    type: Boolean,
    default: true
  }
})

PropertySchema.virtual('daysPosted')
  .get(() => {
    return this.datePosted.diff(moment(Date.now(), 'days'))
  })

const Property = mongoose.model('Pics', PropertySchema)

module.exports = Property
