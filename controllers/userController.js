const db = require('../models');
const jwt = require('jsonwebtoken');

module.exports = {
  login: ((req, res) => {
    db.User.findOne({email : req.body.email})
      .then((user)=>{

      if(user !== null){
        if(user.validPassword(req.body.password)){
          console.log('valid');

          let token = jwt.sign({
            data: { email: user.email, password: user.password, _id: user._id}
          }, 'secret', { expiresIn: '1h' });

          const userInfo = {
            email: user.email,
            userType: user.userType,
            _id: user._id
          }

          res.json({userInfo, token: token});
        }else{
          res.json({errors: 'invalid password', message: 'Password or Username not found'})
        }      
      }else{
        res.json({errors: 'invalid password', message: 'Password or Username not found'})
      }
    })
  }),

  //FOR TESTING ONLY - USE TO TEST AUTHENTICATE ROUTES
  authenticate: ((req, res) => {
    console.log(req.params);
    jwt.verify(req.params.token, 'secret', (err, token)=>{
      console.log(token);
    });
  }),

  register: ((req, res) => {
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
  })
};