const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Category = require('../models/Category');
const User = require('../models/User');
const Project = require('../models/Project');

const categoryResolver = {
	Query: {
		category: (parent, { id }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid id`);
			}

			return Category.findById(id);
		}
	},
	Mutation: {
		createCategory: async (parent, { projectId, title, type }, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}
			const currentProject = await Project.findById(projectId);
			if (!currentProject) {
				throw new UserInputError('Project does not exist.');
			}
			const currentUser = await User.findById(req.userId);

			// check if current user is creator of the project
			if (currentUser.id !== currentProject.creator) {
				throw new AuthenticationError('Only the creator of the project can add new categories.');
			}

			const newCategory = {
				project: currentProject,
				title,
				type,
				issues: []
			};
			const createdCategory = await Category.create(newCategory);
			await currentProject.categories.push(createdCategory);
			await currentProject.save();
			return createdCategory;
		}
	},
	Category: {
		issues: async (category, args, context, info) => {
			return (await category.populate('issues').execPopulate()).issues;
		}
	}
};

module.exports = categoryResolver;
