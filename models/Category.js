const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: String,
		project: {
			type: mongoose.Types.ObjectId,
			ref: 'Project'
		}
	},
	{ timestamps: true }
);

const Category = mongoose.model('Category', schema);

module.exports = Category;
