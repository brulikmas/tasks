import ApolloClient from 'apollo-boost';
import { typeDefs, resolvers } from './graphql/resolvers';
import { persistCache } from 'apollo-cache-persist';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

//хранение в localStorage
// persistCache({
//   cache,
//   storage: window.localStorage,
// }).catch((err) => {
//   console.error('Apollo.persistCache error', err)
// });

//создаем в кэше mock-объект, имитируем данные с сервера
//const check = localStorage.getItem('apollo-cache-persist');
// if (check === null) {
//   cache.writeData({
//     data: {
//       todoTasks: [
//         {
//           __typename: 'Task',
//           id: '1',
//           name: 'Задание 1',
//           todoItems: [{
//             __typename: 'ToDo',
//             id: '1', //пока хранится отдельно и доступ только по id(попробовать изменить)
//             text: '',       //при одинаковом id значения объектов todoItems меняются в разных заданиях
//             done: false,
//           }],
//         }
//       ],
//     },
//   })
// }

export default new ApolloClient({
  cache,
  typeDefs,
  resolvers,
});