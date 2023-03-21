import gql from 'graphql-tag'
import { todoItemsQuery } from './graphql/queries';

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
  type Query {
    todoTasks: [Task]
  }
  type Mutation {
    deleteTask(idTask: ID!): [Task]
    addTask(idTask: ID!): [Task]
    saveTask(todoTasks: Task!, id: ID!): [Task]
  }
`;
export const resolvers = {


  Mutation: {
    deleteTask: (_, { idTask }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const currentItem = data.todoTasks.find(item => item.id === idTask);
      data.todoTasks.splice(data.todoTasks.indexOf(currentItem), 1);
      cache.writeData({ data });
      return data.todoTasks;
    },
    addTask: (_, { idTask }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery });
      const newTask = {
        __typename: 'Task',
        id: idTask,
        name: `Введите задание`,
        todoItems: [{
          __typename: 'Item',
          id: Date.now(),
          text: '',
          done: false,
        }],
      };
      data.todoTasks.push(newTask);
      cache.writeData({ data });
      return data.todoTasks;
    },
    saveTask: (_, { task, id }, { cache }) => {
      const data = cache.readQuery({ query: todoItemsQuery});
      const currentItem = data.todoTasks.find(item => item.id === id);
      data.todoTasks.splice(data.todoTasks.indexOf(currentItem), 1, task);
      cache.writeData({ data });
      return data.todoTasks;
    },
  }
}