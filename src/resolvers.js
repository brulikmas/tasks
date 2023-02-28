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
    deleteItem(idTask: ID!): Boolean
    addItem(idTask: ID!): Task
    saveTask(task: Task!, id: ID!): Task
  }
`;
export const resolvers = {
  Mutation: {
    // checkItem: (_, { id }, { cache }) => {
    //   const data = cache.readQuery({ query: todoItemsQuery});
    //   const currentItem = data.task.todoItems.find(item => item.id === id);
    //   currentItem.done = !currentItem.done;
    //   //cache.writeQuery({ query: todoItemsQuery, data});
    //   return currentItem.done;
    // },
    deleteItem: (_, { idTask }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const currentItem = data.task.find(item => item.id === idTask);
      data.task.splice(data.task.indexOf(currentItem), 1);
      cache.writeQuery({ query: todoItemsQuery, data });
      return true
    },
    addItem: (_, { idTask }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const newItem = {
        __typename: 'Task',
        id: idTask,
        name: `Задание ${data.task.length + 1}`,
        todoItems: [{
          __typename: 'Item',
          id: '1',
          text: 'Введите задачу',
          done: false,
        }],
      };
      data.task.push(newItem);
      cache.writeQuery({ query: todoItemsQuery, data });
      return newItem;
    },
    saveTask: (_, { task, id }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery});
      console.log(data);
      let currentItem = data.task.find(item => item.id === id);
      console.log(currentItem);
      currentItem = {...task};
      currentItem.todoItems = [...currentItem.todoItems];
      for (let i = 0; i < currentItem.todoItems.length; i++) {
        currentItem.todoItems[i] = {...currentItem.todoItems[i]};
      };
      cache.writeQuery({ query: todoItemsQuery, data });
      console.log(data);
      return task;
    },
  }
}