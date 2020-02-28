const { ApolloServer, gql } = require('apollo-server-express');
const Express = require('express');
const resolvers = require('./resolvers/resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const config = require('./config');
const mongoose = require('mongoose');
const isAuth = require('./middleware/isAuth');

try {
	mongoose.connect(config.MONGODB_CONNECTION_STRING);
} catch (err) {
	throw new Error('connection failed');
}
const app = Express();
app.disable('x-powered-by');
app.use(isAuth);

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req })
});

server.applyMiddleware({ app });

app.listen({ port: config.PORT }, () => {
	console.log('server started on port', config.PORT);
});
