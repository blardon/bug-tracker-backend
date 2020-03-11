const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Category = require('../models/Category');
const Project = require('../models/Project');
const Sprint = require('../models/Sprint');

const issueResolver = {
	Query: {
		issue: (parent, { id }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid id`);
			}

			return Issue.findById(id);
		}
	},
	Mutation: {
		updatePriority: async (parent, { issueId, newPriority }, { req }, info) => {
			if (!mongoose.Types.ObjectId.isValid(issueId)) {
				throw new UserInputError(`${issueId} is not a valid id`);
			}
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}
			const currentIssue = await Issue.findById(issueId);
			if (!currentIssue) {
				throw new UserInputError(`Issue ${issueId} does not exist.`);
			}
			const currentProject = await Project.findById(currentIssue.project);
			const currentUser = await User.findById(req.userId);
			if (
				!currentUser.projects.some((project) => {
					return project.equals(currentProject.id);
				})
			) {
				throw new AuthenticationError('User is not allowed to update issues in this project.');
			}
			currentIssue.priority = newPriority;
			await currentIssue.save();
			return currentIssue;
		},
		createIssue: async (parent, { projectId, categoryId, sprintId, title, desc }, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}

			const currentUser = await User.findById(req.userId);
			const currentCategory = await Category.findById(categoryId);
			const currentSprint = await Sprint.findById(sprintId);
			const currentProject = await Project.findById(projectId);

			if (!currentCategory || !currentProject || !currentSprint) {
				throw new UserInputError('The category, the sprint or the project does not exist');
			}

			// TODO: check if category and sprint is in project
			if (
				!currentUser.projects.some((project) => {
					return project.equals(currentProject.id);
				})
			) {
				throw new AuthenticationError('User is not allowed to add issues to this project.');
			}

			const newIssue = {
				title,
				desc,
				priority: 0,
				project: currentProject,
				sprint: currentSprint,
				category: currentCategory,
				creator: currentUser
			};

			const createdIssue = await Issue.create(newIssue);
			await currentProject.issues.push(createdIssue);
			await currentProject.save();
			return createdIssue;
		}
	},
	Issue: {
		category: async (issue, args, context, info) => {
			return Category.findById(issue.category);
		},
		sprint: async (issue, args, context, info) => {
			return Sprint.findById(issue.sprint);
		},
		creator: async (issue, args, context, info) => {
			return User.findById(issue.creator);
		}
	}
};

module.exports = issueResolver;
