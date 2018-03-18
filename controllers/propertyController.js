const db = require('../models')
const axios = require('axios')
const cloudinary = require('cloudinary')
const geoKey = process.env.NODE_ENV ? process.env.geoapi : require('../config.js')

cloudinary.config({
  cloud_name: process.env.NODE_ENV ? process.env.cloud_name : require('../config.js').cloduinary_cloud,
  api_key: process.env.NODE_ENV ? process.env.cloudinary : require('../config.js').cloudinary,
  api_secret: process.env.NODE_ENV ? process.env.cloudinary_secret : require('../config.js').cloudinary_secret
})

module.exports = {

  //  UPLOAD HOUSING DATA
  upload: async(req, res) => {
    let imgUrl = [], promises = []

    console.log(req.body);

    req.body.imgs.map((file) => {
      promises.push(
          cloudinary.uploader.upload(file.path, function (result) {
          imgUrl.push(result.url)
        })
      )
    })

    const geoapi = process.env.NODE_ENV ? process.env.geoapi : require('../config.js').geoapi

    Promise.all(promises).then(()=>{
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.address}&key=${geoapi}`).then((resp) => {
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

    if (params.hasOwnProperty('address') && params.address !== null) {
      await getLonLat(params.address).then((resp, err) => {
        if (err) {
          console.log(err)
          throw err
        }

        [lon, lat] = [resp.data.results[0].geometry.location.lng, resp.data.results[0].geometry.location.lat]
      })
      andClauses.push({location: {$near: [lon, lat], $maxDistance: 10 / 10}})
    }

    if (params.hasOwnProperty('bedRooms')) {
      andClauses.push({ bedRooms: { $gte: (params.bedRooms || 0) } })
    }

    if (params.hasOwnProperty('maxPrice') && params.hasOwnProperty('minPrice')) {
      andClauses.push({ price: { $gt: (params.minPrice || 0), $lt: (params.maxPrice || 1000000) } })
    }

    if (params.hasOwnProperty('propertyType')) {
      if (params.propertyType !== null) {
        andClauses.push({"propertyType": params.propertyType})
      }
    }

    let {maxPrice, minPrice, address, bedRooms, propertyType, ...whereClause} = params

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
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoKey.geoapi}`)
}
