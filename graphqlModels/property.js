const graphql = require("graphql");
const graphqlDate = require("graphql-date");
const db = require("../models");

const propertyType = new graphql.GraphQLObjectType({
    name: "property",
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
            }
        };
    }
});

const propertyQueryType = new graphql.GraphQLObjectType({
    name: "Query",
    fields: function() {
        return {
            properties: {
                type: new graphql.GraphQLList(propertyType),
                resolve: function() {
                    return db.Property.find({});
                }
            },
            property: {
                type: propertyType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function(_, args) {
                    return db.Property.findById(args.id);
                }
            }
        };
    }
});

module.exports = new graphql.GraphQLSchema({
    query: propertyQueryType
});
