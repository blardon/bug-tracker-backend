const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { createAccessToken, createRefreshToken, sendRefreshTokenCookie } = require('../utils/jwt_tokens');

module.exports = async (req, res) => {
	const token = req.cookies.jid;
	if (!token) {
		return res.send({ ok: false, accessToken: '' });
	}

	let payload = null;
	try {
		payload = jwt.verify(token, config.JWT_REFRESH_KEY);
	} catch (err) {
		return res.send({ ok: false, accessToken: '' });
	}

	const user = await User.findById(payload.userId);
	if (!user) {
		return res.send({ ok: false, accessToken: '' });
	}

	if (user.tokenVersion !== payload.tokenVersion) {
		return res.send({ ok: false, accessToken: '' });
	}

	sendRefreshTokenCookie(res, createRefreshToken(user));
	return res.send({ ok: true, accessToken: createAccessToken(user) });
};
