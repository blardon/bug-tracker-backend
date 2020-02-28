const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		name: String,
		desc: String,
		creator: {
			type: mongoose.Types.ObjectId,
			ref: 'User'
		},
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
