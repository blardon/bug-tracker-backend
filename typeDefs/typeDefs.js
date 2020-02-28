const { gql } = require('apollo-server-express');
const projectDef = require('./Project');
const userDef = require('./User');
const issueDef = require('./Issue');

const root = gql`
	type Query {
		_: String
	}

	type Mutation {
		_: String
	}

	type Subscription {
		_: String
	}
`;

module.exports = [ root, projectDef, userDef, issueDef ];
