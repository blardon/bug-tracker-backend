const projectResolver = require('./Project');
const userResolver = require('./User');
const categoryResolver = require('./Category');
const issueResolver = require('./Issue');

module.exports = [ projectResolver, userResolver, categoryResolver, issueResolver ];
