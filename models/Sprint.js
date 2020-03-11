const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		title: String,
		desc: String,
		project: {
			type: mongoose.Types.ObjectId,
			ref: 'Project'
		}
	},
	{ timestamps: true }
);

const Sprint = mongoose.model('Sprint', schema);

module.exports = Sprint;
