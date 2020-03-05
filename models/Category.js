const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: String,
		type: String,
		project: {
			type: mongoose.Types.ObjectId,
			ref: 'Project'
		},
		issues: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Issue'
			}
		]
	},
	{ timestamps: true }
);

const Category = mongoose.model('Category', schema);

module.exports = Category;
