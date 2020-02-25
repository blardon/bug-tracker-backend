const mongoose = require('mongoose');

const Project = mongoose.model('Project', {
	name: String,
	desc: String,
	createdAt: Date
});
