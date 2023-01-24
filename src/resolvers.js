import gql from 'graphql-tag'
import { todoItemsQuery } from './graphql/queries';
import shortid from 'shortid'

export const typeDefs = gql`
  type Item {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Task {
    id: ID!
    name: String!
    item: Item
  }

  type Mutation {
    checkItem(id: ID!): Boolean
    deleteItem(id: ID!): Boolean
    addItem(text: String!): Item
  }
`;
export const resolvers = {
  Mutation: {
    checkItem: (_, { id }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery});
      const currentItem = data.task.todoItems.find(item => item.id === id);
      currentItem.done = !currentItem.done;
      //cache.writeQuery({ query: todoItemsQuery, data});
      return currentItem.done;
    },
    deleteItem: (_, { id }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const currentItem = data.task.todoItems.find(item => item.id === id);
      data.task.todoItems.splice(data.task.todoItems.indexOf(currentItem), 1);
      //cache.writeQuery({ query: todoItemsQuery, data });
      return true
    },
    addItem: (_, { text }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const newItem = {
        __typename: 'Item',
        id: shortid.generate(),
        text,
        done: false,
      };
      data.task.todoItems.push(newItem);
      //cache.writeQuery({ query: todoItemsQuery, data });
      return newItem;
    }
  }
}