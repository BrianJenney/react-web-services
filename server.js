const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
const mongo = require('mongodb');
const mongoose = require("mongoose");
const uri = process.env.NODE_ENV ? process.env.mongo : require('./config.js').mongo;
const jwt = require('jsonwebtoken');

mongoose.connect(uri);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8081);

//ROUTES
app.use(routes);
