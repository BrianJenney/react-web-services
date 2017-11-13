// Dependency
const mongoose = require("mongoose");

// Create the Schema class
const Schema = mongoose.Schema;

const PicsSchema = new Schema({

  //id of user who posted
  userid: {
    type: String
  },
  userEmail:{
    type: String,
    trim: true
  },
  //url of pic
  imgUrl: {
    type: String,
    trim: true
  },

  zip:{
    type: Number
  },

  price: {
    type: Number
  },

  city: {
    type: String
  }
});

const Pics = mongoose.model("Pics", PicsSchema);

module.exports = Pics;
