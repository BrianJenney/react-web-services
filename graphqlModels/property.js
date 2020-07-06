const graphql = require('graphql');
const graphqlDate = require('graphql-date');
const { ObjectId } = require('mongodb');
const db = require('../models');

const propertyType = new graphql.GraphQLObjectType({
	name: 'property',
	fields: function() {
		return {
			id: {
				type: graphql.GraphQLID
			},
			userId: {
				type: graphql.GraphQLID
			},
			status: {
				type: graphql.GraphQLString
			},
			propertyType: {
				type: graphql.GraphQLString
			},
			description: {
				type: graphql.GraphQLString
			},
			imgs: {
				type: new graphql.GraphQLList(graphql.GraphQLString)
			},
			disclosureAgreement: {
				type: graphql.GraphQLString
			},
			transferDisclosure: {
				type: graphql.GraphQLString
			},
			leadPaintDisclosure: {
				type: graphql.GraphQLString
			},
			naturalHazardDisclosure: {
				type: graphql.GraphQLString
			},
			statewideAdvisory: {
				type: graphql.GraphQLString
			},
			address: {
				type: graphql.GraphQLString
			},
			price: {
				type: graphql.GraphQLInt
			},
			bedRooms: {
				type: graphql.GraphQLInt
			},
			bathRooms: {
				type: graphql.GraphQLInt
			},
			yearBuilt: {
				type: graphqlDate
			},
			datePosted: {
				type: graphqlDate
			},
			sqFeet: {
				type: graphql.GraphQLInt
			},
			sqFeetLotSize: {
				type: graphql.GraphQLInt
			},
			validProperty: {
				type: graphql.GraphQLBoolean
			},
			likes: {
				type: new graphql.GraphQLList(graphql.GraphQLString)
			}
		};
	}
});

const propertyQueryType = new graphql.GraphQLObjectType({
	name: 'Query',
	fields: () => {
		return {
			properties: {
				type: new graphql.GraphQLList(propertyType),
				resolve: () => {
					return db.Property.find({});
				}
			},
			property: {
				type: propertyType,
				args: {
					id: { type: graphql.GraphQLString }
				},
				resolve: (_, args) => {
					return db.Property.findById(args.id);
				}
			}
		};
	}
});

const propertyLikesMutation = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: () => {
		return {
			addLike: {
				type: propertyType,
				args: {
					id: { type: graphql.GraphQLString },
					userId: { type: graphql.GraphQLString }
				},
				resolve: (_, args) => {
					return db.Property
						.findOneAndUpdate(
							{ _id: new ObjectId(args.id) },
							{
								$addToSet: {
									likes: args.userId
								}
							}
						)
						.then((doc) => doc)
						.catch((err) => err);
				}
			}
		};
	}
});

module.exports = new graphql.GraphQLSchema({
	query: propertyQueryType,
	mutation: propertyLikesMutation
});
