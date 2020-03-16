const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const Sprint = require('../models/Sprint');
const User = require('../models/User');
const Project = require('../models/Project');

const sprintResolver = {
	Query: {
		sprint: (parent, { id }, context, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid id`);
			}

			return Sprint.findById(id);
		}
	},
	Mutation: {
		createSprint: async (parent, { projectId, title, desc }, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}
			const currentProject = await Project.findById(projectId);
			if (!currentProject) {
				throw new UserInputError('Project does not exist.');
			}
			const currentUser = await User.findById(req.userId);

			// check if current user is creator of the project
			if (currentUser.id != currentProject.creator) {
				throw new AuthenticationError('Only the creator of the project can add new sprints.');
			}

			const newSprint = {
				project: currentProject,
				title,
				desc
			};
			const createdSprint = await Sprint.create(newSprint);
			await currentProject.sprints.push(createdSprint);
			await currentProject.save();
			return createdSprint;
		}
	},
	Sprint: {
		project: async (sprint, args, context, info) => {
			return Project.findById(sprint.project);
		},
		issues: async (sprint, args, context, info) => {
			const currentProject = await Project.findById(sprint.project);
			return (await currentProject.populate('issues').execPopulate()).issues.filter((issue) => issue.sprint == sprint.id);
		}
	}
};

module.exports = sprintResolver;
