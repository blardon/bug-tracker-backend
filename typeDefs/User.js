const { gql } = require('apollo-server-express');

const userDef = gql`
	type User {
		id: ID!
		username: String!
		email: String!
		projects: [Project!]!
		createdAt: String!
	}

	type AuthData {
		user: User!
		token: String!
	}

	extend type Query {
		user(id: ID!): User
		users: [User!]!
		login(username: String!, password: String!): AuthData
	}

	extend type Mutation {
		createUser(username: String!, email: String!, password: String!): AuthData
	}
`;

module.exports = userDef;
