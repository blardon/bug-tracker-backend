const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Project = require('../models/Project');
const User = require('../models/User');
const Category = require('../models/Category');
const ProjectValidation = require('../validationSchemas/Project');

const projectResolver = {
	Query: {
		projects: (parent, args, context, info) => {
			return Project.find();
		},
		project: (parent, { id }, context, info) => {
			// TODO: Auth checks
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid id`);
			}

			return Project.findById(id);
		}
	},
	Mutation: {
		createProject: async (parent, args, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}
			const currentUser = await User.findById(req.userId);
			// Validate user input, if wrong abort and throw error
			await ProjectValidation.validateAsync(args);

			// add standard board types
			const newProject = {
				...args,
				creator: req.userId,
				issues: [],
				sprints: [],
				categories: []
			};

			const createdProject = await Project.create(newProject);
			const createdCategory1 = await Category.create({
				project: createdProject,
				title: 'To do'
			});
			const createdCategory2 = await Category.create({
				project: createdProject,
				title: 'In progress'
			});
			const createdCategory3 = await Category.create({
				project: createdProject,
				title: 'Done'
			});
			await createdProject.categories.push(createdCategory1, createdCategory2, createdCategory3);
			await createdProject.save();
			await currentUser.projects.push(createdProject);
			await currentUser.save();
			return createdProject;
		}
	},
	Project: {
		creator: (project, args, context, info) => {
			return User.findById(project.creator);
		},
		issues: async (project, args, context, info) => {
			return (await project.populate('issues').execPopulate()).issues;
		},
		sprints: async (project, args, context, info) => {
			return (await project.populate('sprints').execPopulate()).sprints;
		},
		categories: async (project, args, context, info) => {
			return (await project.populate('categories').execPopulate()).categories;
		}
	}
};

module.exports = projectResolver;
