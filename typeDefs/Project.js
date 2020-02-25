const { gql } = require('apollo-server-express');

const projectDef = gql`
	type Project {
		id: ID!
		name: String!
		desc: String!
		createdAt: String!
	}

	extend type Query {
		project(id: ID!): Project
		projects: [Project!]!
	}

	extend type Mutation {
		createProject(name: String!, desc: String!): Project
	}
`;

module.exports = projectDef;
