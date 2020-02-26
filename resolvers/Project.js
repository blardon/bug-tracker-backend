const mongoose = require('mongoose');
const { UserInputError } = require('apollo-server-express');
const Project = require('../models/Project');
const ProjectValidation = require('../validationSchemas/Project');
const Joi = require('@hapi/joi');

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
		createProject: async (parent, args, context, info) => {
			// TODO: user authed

			await ProjectValidation.validateAsync(args)

			const newProject = {
				...args,
				types: [ 'todo', 'inprogress', 'done' ]
			};

			return Project.create(newProject);
		}
	}
};

module.exports = projectResolver;
