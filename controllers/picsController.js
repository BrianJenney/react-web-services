const db = require('../models')
const keys = require('../config.js')
const axios = require('axios')
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: keys.cloduinary_cloud,
  api_key: keys.cloudinary,
  api_secret: keys.cloudinary_secret
})

module.exports = {

  //  UPLOAD HOUSING DATA
  upload: (req, res) => {
    let imgUrl, promise

    promise = cloudinary.uploader.upload(req.files.imgUrl.path, function (result) {
      imgUrl = result.url
    })

    let address = `${req.body.address} ${req.body.city}, ${req.body.state}, ${req.body.zipCode}`

    promise.then(() => {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keys.geoapi}`).then((resp) => {
        req.body.location = [resp.data.results[0].geometry.location.lng, resp.data.results[0].geometry.location.lat]
        req.body.imgUrl = [imgUrl]
      }).then(() => {
        if (Object.keys(req.body).length === 0) { return }
        db.Pics.create(req.body)
          .then(doc => res.json(doc))
          .catch(err => res.json(err))
      })
    })
  },

  //  GET ALL LISTINGS
  getListings: (req, res) => {
    db.Pics.find({})
      .then(doc => res.json(doc))
      .catch(err => res.json(err))
  },

  //  LISTINGS BY USER
  getListingsByUser: (req, res) => {
    db.Pics.find({'userEmail': req.params.email})
      .then(doc => res.json(doc))
      .catch(err => res.json(err))
  },

  //  SEARCH LISTINGS
  searchListings: async (req, res) => {
    let conditions = {}
    let andClauses = []
    let lon, lat

    let params = JSON.parse(JSON.stringify(req.body))

    if (params.hasOwnProperty('address') && params.address.length) {
      await getLonLat(params.address).then((resp) => {
        [lon, lat] = [resp.data.results[0].geometry.location.lng, resp.data.results[0].geometry.location.lat]
      })
      andClauses.push({location: {$near: [lon, lat], $maxDistance: 10 / 10}})
    }

    if (params.hasOwnProperty('bedRooms')) {
      andClauses.push({ bedRooms: { $gte: params.bedRooms } })
    }

    if (params.hasOwnProperty('maxPrice') && params.hasOwnProperty('minPrice')) {
      andClauses.push({ price: { $gt: params.minPrice, $lt: params.maxPrice } })
    }

    let {maxPrice, minPrice, address, bedRooms, ...whereClause} = params

    for (const prop in whereClause) {
      let query = {}
      query[prop] = whereClause[prop]
      andClauses.push(query)
    }

    conditions['$and'] = andClauses

    db.Pics.find(conditions)
      .then(doc => res.json(doc))
      .catch(err => res.json(err))
  }
}

//  GET ADDRESS LONGITUDE AND LATITUDE
function getLonLat (address) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keys.geoapi}`)
}
