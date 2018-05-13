const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const token = req.headers['authorization']
  console.log(token);
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' })
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded._id
    next()
  })
}
module.exports = verifyToken
