import Vue from 'vue';
import App from './App.vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { typeDefs, resolvers } from './resolvers';
import { persistCache } from 'apollo-cache-persist';

Vue.use(VueApollo);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
}).catch((err) => {
  console.error('Apollo.persistCache error', err)
});

const apolloClient = new ApolloClient({
  cache,
  typeDefs,
  resolvers,
});


const check = localStorage.getItem('apollo-cache-persist');
if (check === null) {
  cache.writeData({
    data: {
      todoItems: [],
    },
  })
}

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  render: h => h(App),
  apolloProvider,
}).$mount('#app')
