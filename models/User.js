const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema(
	{
		username: String,
		email: String,
		password: String,
		projects: [ mongoose.Types.ObjectId ],
		tokenVersion: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

schema.pre('save', async function() {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10);
	}
});

const User = mongoose.model('User', schema);

module.exports = User;
