const db = require("../models");

module.exports = {
  login: function(req, res) { //is user in DB ? verify : add new user
    console.log(req.body);
    db.User.find({email : req.body.email, password: req.body.password}).then((doc)=>{
      res.json(doc);
    })
  },
  register: function(req, res){
    db.User.create(req.body)
    .then(doc => res.json(doc))
    .catch(err => res.json(err));
  }
};