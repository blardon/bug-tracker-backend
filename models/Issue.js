const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: String,
		desc: String,
		priority: Number,
		type: String,
		project: {
			type: mongoose.Types.ObjectId,
			ref: 'Project'
		},
		creator: {
			type: mongoose.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

schema.pre('remove', async function() {
	if (this.isModified('name')) {
	}
});

const Issue = mongoose.model('Issue', schema);

module.exports = Issue;
