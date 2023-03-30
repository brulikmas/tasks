import ApolloClient from 'apollo-boost';
import { typeDefs, resolvers } from './graphql/resolvers';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  typeDefs,
  resolvers,
});