const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Category = require('../models/Category');
const Project = require('../models/Project');

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
			const currentUser = await User.findById(req.userId);
			//TODO: check if user can edit issue

			currentIssue.priority = newPriority;
			await currentIssue.save();
			return true;
		},
		createIssue: async (parent, { categoryId, title, desc }, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}

			const currentUser = await User.findById(req.userId);
			const currentCategory = await Category.findById(categoryId);
			const currentProject = await Project.findById(currentCategory.project);

			if (!currentCategory) {
				throw new UserInputError('The category does not exist');
			}

			// TODO: check if user is allowed to add issue to category/project
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
				category: currentCategory,
				creator: currentUser
			};

			const createdIssue = await Issue.create(newIssue);
			await currentCategory.issues.push(createdIssue);
			await currentCategory.save();
			return createdIssue;
		}
	},
	Category: {
		issues: async (category, args, context, info) => {
			return (await category.populate('issues').execPopulate()).issues;
		}
	}
};

module.exports = issueResolver;
