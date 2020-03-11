const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: String,
		desc: String,
		users: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User'
			}
		],
		issues: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Issue'
			}
		],
		categories: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Category'
			}
		],
		sprints: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Sprint'
			}
		],
		creator: {
			type: mongoose.Types.ObjectId,
			ref: 'User'
		},
		types: [ String ]
	},
	{ timestamps: true }
);

schema.pre('remove', async function() {
	if (this.isModified('title')) {
	}
});

const Project = mongoose.model('Project', schema);

module.exports = Project;
