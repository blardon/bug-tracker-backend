const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		name: String,
		desc: String,
		types: [ String ]
	},
	{ timestamps: true }
);

schema.pre('save', async function() {
	if (this.isModified('name')) {
	}
});

const Project = mongoose.model('Project', schema);

module.exports = Project;
