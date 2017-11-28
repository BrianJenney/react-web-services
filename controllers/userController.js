const db = require('../models');

module.exports = {
  login: function(req, res) { //is user in DB ? verify : add new user
    db.User.findOne({email : req.body.email})
      .then((user)=>{
        console.log(user);
      if(user !== null){
        console.log(user.validPassword(req.body.password));
        if(user.validPassword(req.body.password)){
          res.json(user);
        }else{
          res.json({errors: 'invalid password', message: 'Password or Username not found'})
        }      
      }
    })
  },

  register: function(req, res){
    let newUser = db.User({
      income: req.body.income,
      SSN: req.body.SSN,
      userType: req.body.userType,
      email: req.body.email
    });
    //hash password
    newUser.password = newUser.generateHash(req.body.password);

    newUser.save()
    .then(doc => res.json(doc))
    .catch(err => res.json(err));
  }
};