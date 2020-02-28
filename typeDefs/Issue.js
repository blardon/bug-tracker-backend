const { gql } = require('apollo-server-express');

const issueDef = gql`
	type Issue {
		id: ID!
		name: String!
		desc: String!
		creator: User!
		type: String!
		createdAt: String!
	}

	extend type Query {
		issue(id: ID!): Issue
		issues: [Issue!]!
	}

	extend type Mutation {
		createIssue(name: String!, desc: String!): Issue
	}
`;

module.exports = issueDef;
