const Joi = require('@hapi/joi');

module.exports = Joi.object({
	name: Joi.string().alphanum().min(3).max(100).required(),
	desc: Joi.string()
});
