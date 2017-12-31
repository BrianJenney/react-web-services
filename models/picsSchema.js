// Dependency
const mongoose = require("mongoose");
const moment = require("moment");

// Create the Schema class
const Schema = mongoose.Schema;

const PicsSchema = new Schema({

  //id of user who posted
  userid: {
    type: String
  },
  propertyType:{
    type: String
  },
  description: {
    type: String
  },
  imgUrl: [{
    type: String,
    trim: true
  }],
  zipCode:{
    type: Number
  },
  city: {
    type: String
  },
  state:{
    type: String
  },
  address:{
    type: String
  },
  location:{
    type: [Number],
    index: '2d'
  },
  price: {
    type: Number
  },
  sqFeet:{
    type: Number
  },
  bedRooms:{
    type: Number
  },
  bathRooms:{
    type: Number
  },
  yearBuilt:{
    type: Date
  },
  datePosted:{
    type: Date,
    default: Date.now()
  },
  parkingSpaces:{
    type: Number
  },
  amenities:[
    {
      type: String
    }
  ]
});

PicsSchema.virtual('daysPosted')
.get(()=>{
  return this.datePosted.diff(moment(Date.now(), 'days'));
});

const Pics = mongoose.model("Pics", PicsSchema);

module.exports = Pics;
