const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
//const UserValidation = require('../validationSchemas/User');

const userResolver = {
	Query: {
		users: (parent, args, context, info) => {
			return User.find();
		},
		user: (parent, { id }, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('User is not signed in');
			}
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} is not a valid id.`);
			}

			return User.findById(id);
		},
		login: async (parent, { username, password }, { req }, info) => {
			if (req.isAuth) {
				throw new AuthenticationError('User is already signed in');
			}
			if (!await User.findOne({ username: username })) {
				throw new UserInputError(`user ${username} does not exist.`);
			}
			const user = await User.findOne({ username: username });

			if (!await bcrypt.compare(password, user.password)) {
				throw new AuthenticationError('Wrong password');
			}

			const authToken = jwt.sign({ userId: user.id }, config.JWT_AUTH_KEY, { expiresIn: '1y' });

			return { user: user, token: authToken };
		}
	},
	Mutation: {
		createUser: async (parent, args, { req }, info) => {
			if (req.isAuth) {
				throw new AuthenticationError('User is already signed in');
			}

			const newUser = await User.create(args);
			const authToken = jwt.sign({ userId: newUser.id }, config.JWT_AUTH_KEY, { expiresIn: '1y' });

			return { user: newUser, token: authToken };
		}
	},
	User: {
		projects: (user, args, { req }, info) => {
			if (!req.isAuth) {
				throw new AuthenticationError('Not signed in.');
			}

			return Project.find({ _id: { $in: user.projects } });
		}
	}
};

module.exports = userResolver;
