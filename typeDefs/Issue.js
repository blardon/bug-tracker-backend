const { gql } = require('apollo-server-express');

const issueDef = gql`
	type Issue {
		id: ID!
		title: String!
		desc: String!
		project: Project!
		category: Category!
		sprint: Sprint!
		priority: Int!
		creator: User!
		createdAt: String!
	}

	extend type Query {
		issue(id: ID!): Issue
		issues: [Issue!]!
	}

	extend type Mutation {
		createIssue(projectId: ID!, categoryId: ID!, sprintId: ID!, title: String!, desc: String!): Issue
		updatePriority(issueId: ID!, newPriority: Int!): Issue
	}
`;

module.exports = issueDef;
