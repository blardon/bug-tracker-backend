const { gql } = require('apollo-server-express');

const categoryDef = gql`
	type Category {
		id: ID!
		title: String!
		type: String!
		project: Project!
		issues: [Issue!]!
	}

	extend type Query {
		category(id: ID!): Category
	}

	extend type Mutation {
		createCategory(projectId: ID!, title: String!, type: String!): Issue
	}
`;

module.exports = categoryDef;
