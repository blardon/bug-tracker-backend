const Joi = require('@hapi/joi');

module.exports = Joi.object({
	title: Joi.string().alphanum().min(3).max(100).required(),
	desc: Joi.string()
});
