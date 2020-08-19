const router = require('express').Router();
const graphqlHTTP = require('express-graphql');
const propertySchema = require('../../graphqlModels/property');
const propertyController = require('../../controllers/propertyController');
const verify = require('../auth/authVerify.js');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

router.route('/upload').post(multipartMiddleware, propertyController.createProperty);

router.route('/edit').post(multipartMiddleware, propertyController.editProperty);

router.route('/properties').get(propertyController.getListings);

router.route('/getlistingsbyuser/:email').get(propertyController.getListingsByUser);

router.route('/searchlistings').post(propertyController.searchListings);

router.route('/info/:id').get(propertyController.houseInfo);

router.route('/disclosure').post(multipartMiddleware, propertyController.uploadDocument);

router.route('/favorites').post(verify, propertyController.getFavoritedProperties);

router.use(
	'/graphql',
	graphqlHTTP({
		schema: propertySchema,
		graphiql: true
	})
);

module.exports = router;
