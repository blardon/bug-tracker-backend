const jwt = require('jsonwebtoken');
const config = require('../config');

const createAccessToken = (user) => {
	return jwt.sign({ userId: user.id }, config.JWT_AUTH_KEY, { expiresIn: '15m' });
};

const createRefreshToken = (user) => {
	return jwt.sign({ userId: user.id, tokenVersion: user.tokenVersion }, config.JWT_REFRESH_KEY, { expiresIn: '30d' });
};

const sendRefreshTokenCookie = (res, token) => {
	res.cookie('jid', token, { httpOnly: true });
};

module.exports = { createAccessToken, createRefreshToken, sendRefreshTokenCookie };
