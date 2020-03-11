const { gql } = require('apollo-server-express');

const sprintDef = gql`
	type Sprint {
		id: ID!
		title: String!
		desc: String!
		project: Project!
	}

	extend type Query {
		sprint(id: ID!): Sprint
	}

	extend type Mutation {
		createSprint(projectId: ID!, title: String!, desc: String!): Sprint
	}
`;

module.exports = sprintDef;
