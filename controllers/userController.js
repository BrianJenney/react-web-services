const db = require('../models');

module.exports = {
  login: function(req, res) {
    db.User.findOne({email : req.body.email})
      .then((user)=>{

      if(user !== null){
        if(user.validPassword(req.body.password)){
          res.json(user);
        }else{
          res.json({errors: 'invalid password', message: 'Password or Username not found'})
        }      
      }else{
        res.json({errors: 'invalid password', message: 'Password or Username not found'})
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