const { gql } = require('apollo-server-express');

const categoryDef = gql`
	type Category {
		id: ID!
		title: String!
		project: Project!
	}

	extend type Query {
		category(id: ID!): Category
	}

	extend type Mutation {
		createCategory(projectId: ID!, title: String!): Category
	}
`;

module.exports = categoryDef;
