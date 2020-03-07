const { gql } = require('apollo-server-express');

const issueDef = gql`
	type Issue {
		id: ID!
		title: String!
		desc: String!
		category: Category!
		priority: Int!
		creator: User!
		createdAt: String!
	}

	extend type Query {
		issue(id: ID!): Issue
		issues: [Issue!]!
	}

	extend type Mutation {
		createIssue(categoryId: ID!, title: String!, desc: String!): Issue
		updatePriority(issueId: ID!, newPriority: Int!): Boolean
	}
`;

module.exports = issueDef;
