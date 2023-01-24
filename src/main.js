import Vue from 'vue';
import App from './App.vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { typeDefs, resolvers } from './resolvers';
import { persistCache } from 'apollo-cache-persist';
import vuetify from './plugins/vuetify'

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
      task: [
        {
          __typename: 'Task',
          id: '1',
          name: 'Задание 1',
          todoItems: [{
            __typename: 'Item',
            id: '1',
            text: 'задача 1',
            done: false,
          }],
        }
      ],
    },
  })
}

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  render: h => h(App),
  vuetify,
  apolloProvider
}).$mount('#app')
