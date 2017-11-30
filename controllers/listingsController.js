

const request = require('request')
const username = 'simplyrets'
const password = 'simplyrets'
const options = {
  url: 'https://api.simplyrets.com/properties?q=texas&status=Active&type=residential&sort=listprice&count=100',
  auth: {
    user: username,
    password: password
  }
}

module.exports = {

    getHomeListings: function(req, res){
        request(options, function (err, resp, body) {
            if (err) {
              console.dir(err)
              return
            }

            res.send(JSON.parse(JSON.stringify(body)));
          })
    }

}

