const { ApolloServer, gql } = require('apollo-server-express');
const Express = require('express');
const resolvers = require('./resolvers/resolvers');
const typeDefs = require('./typeDefs/typeDefs');

const app = Express();
app.disable('x-powered-by');

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
	console.log('server started...');
});
