const { ApolloServer, gql } = require('apollo-server-express');
const Express = require('express');
const cookieParser = require('cookie-parser');
const resolvers = require('./resolvers/resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const config = require('./config');
const mongoose = require('mongoose');
const isAuth = require('./middleware/isAuth');
const checkTokens = require('./middleware/checkTokens');

try {
	mongoose.connect(config.MONGODB_CONNECTION_STRING, {
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
} catch (err) {
	throw new Error('connection failed');
}
const app = Express();
app.use(cookieParser());
app.disable('x-powered-by');
app.use(isAuth);
app.post('/refresh_token', checkTokens);

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res })
});

server.applyMiddleware({ app });

app.listen({ port: config.PORT }, () => {
	console.log('server started on port', config.PORT);
});
