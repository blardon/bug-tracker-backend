const projectResolver = {
	Query: {
		projects: (parent, arg, context, info) => {},
		project: (parent, arg, context, info) => {}
	},
	Mutation: {
		createProject: (parent, arg, context, info) => {}
	}
};

module.exports = projectResolver;
