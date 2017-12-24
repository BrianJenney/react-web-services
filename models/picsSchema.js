// Dependency
const mongoose = require("mongoose");

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
  amenities:[
    {
      type: String
    }
  ]
});

const Pics = mongoose.model("Pics", PicsSchema);

module.exports = Pics;
