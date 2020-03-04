const mongoose = require('mongoose');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { createAccessToken, createRefreshToken, sendRefreshTokenCookie } = require('../utils/jwt_tokens');
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
		}
	},
	Mutation: {
		revokeRefreshTokenForUser: async (parent, args, { req, res }, info) => {
			await User.findByIdAndUpdate(args.userId, { $inc: { tokenVersion: 1 } }).exec();
			return true;
		},
		login: async (parent, { username, password }, { req, res }, info) => {
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

			const authToken = createAccessToken(user);
			const refreshToken = createRefreshToken(user);

			sendRefreshTokenCookie(res, refreshToken);

			return { user: user, token: authToken };
		},
		createUser: async (parent, args, { req, res }, info) => {
			if (req.isAuth) {
				throw new AuthenticationError('User is already signed in');
			}
			if (await User.findOne({ username: args.username })) {
				throw new UserInputError('Username is already in use');
			}

			const newUser = await User.create(args);
			const authToken = createAccessToken(newUser);
			const refreshToken = createRefreshToken(newUser);

			sendRefreshTokenCookie(res, refreshToken);
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
