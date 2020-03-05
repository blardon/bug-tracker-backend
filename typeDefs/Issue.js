const { gql } = require('apollo-server-express');

const issueDef = gql`
	type Issue {
		id: ID!
		title: String!
		desc: String!
		project: Project!
		priority: Int!
		creator: User!
		type: String!
		createdAt: String!
	}

	extend type Query {
		issue(id: ID!): Issue
		issues: [Issue!]!
	}

	extend type Mutation {
		createIssue(title: String!, desc: String!): Issue
	}
`;

module.exports = issueDef;
