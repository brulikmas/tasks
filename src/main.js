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
            id: Date.now(), //пока хранится отдельно и доступ только по id(попробовать изменить)
            text: 'задача 1',       //при одинаковом id значения объектов todoItems меняются в разных заданиях
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
