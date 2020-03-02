const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Project = require('../models/Project');
const User = require('../models/User');
const ProjectValidation = require('../validationSchemas/Project');

const projectResolver = {
	Query: {
		projects: (parent, args, context, info) => {
			return Project.find();
		},
		project: (parent, { id }, context, info) => {
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

			// Validate user input, if wrong abort and throw error
			await ProjectValidation.validateAsync(args);

			// add standard board types
			const newProject = {
				...args,
				creator: req.userId,
				types: [ 'todo', 'inprogress', 'done' ]
			};

			const createdProject = await Project.create(newProject);
			const currentUser = await User.findById(req.userId);
			await currentUser.projects.push(createdProject);
			await currentUser.save();
			return createdProject;
		}
	},
	Project: {
		creator: (project, args, context, info) => {
			return User.findById(project.creator);
		}
	}
};

module.exports = projectResolver;
