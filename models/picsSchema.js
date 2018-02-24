const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const PicsSchema = new Schema({

  //  id of user who posted

  userid: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imgUrl: [{
    type: String,
    required: true
  }],
  zipCode: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
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
  sqFeet: {
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
    required: true
  },
  amenities: [
    {
      type: String
    }
  ]
})

PicsSchema.virtual('daysPosted')
  .get(() => {
    return this.datePosted.diff(moment(Date.now(), 'days'))
  })

const Pics = mongoose.model('Pics', PicsSchema)

module.exports = Pics
