const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	const token = authHeader.split(' ')[1];
	if (!token || token === '') {
		req.isAuth = false;
		return next();
	}

	let payload;
	try {
		payload = jwt.verify(token, config.JWT_AUTH_KEY);
	} catch (err) {
		req.isAuth = false;
		return next();
	}

	if (!payload) {
		req.isAuth = false;
		return next();
	}

	req.isAuth = true;
	req.userId = payload.userId;
	next();
};
