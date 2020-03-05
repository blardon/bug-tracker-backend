const { gql } = require('apollo-server-express');

const projectDef = gql`
	type Project {
		id: ID!
		title: String!
		desc: String!
		creator: User!
		users: [User!]!
		categories: [Category!]!
		types: [String!]!
		createdAt: String!
	}

	extend type Query {
		project(id: ID!): Project
		projects: [Project!]!
	}

	extend type Mutation {
		createProject(title: String!, desc: String!): Project
	}
`;

module.exports = projectDef;
