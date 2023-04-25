import gql from 'graphql-tag';
import { todoTasks } from './mockData';

export const typeDefs = gql`
  type ToDo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Task {
    id: ID!
    name: String!
    todoItems: [ToDo]!
  }
  type Query {
    todoTasks: [Task]!
  }
  type Mutation {
    deleteTask(idTask: ID!): [Task]
    addTask(idTask: ID!): [Task]
    saveTask(task: Task!, idTask: ID!): [Task]
  }
`;

export const resolvers = {
  Query: {
    todoTasks: () => {
      return todoTasks;
    },
  },
  Mutation: {
    deleteTask: (_, { idTask }) => {
      const currentItem = todoTasks.find(item => item.id === idTask);
      todoTasks.splice(todoTasks.indexOf(currentItem), 1);
      localStorage.storageTasks = JSON.stringify(todoTasks);
      return todoTasks;
    },
    addTask: (_, { idTask }) => {
      const newTask = {
        __typename: 'Task',
        id: idTask,
        name: `Введите задание`,
        todoItems: [{
          __typename: 'ToDo',
          id: Date.now(),
          text: '',
          done: false,
        }],
      };
      todoTasks.push(newTask);
      localStorage.storageTasks = JSON.stringify(todoTasks);
      return todoTasks;
    },
    saveTask: (_, { task, idTask }) => {
      const currentItem = todoTasks.find(item => item.id === idTask);
      todoTasks.splice(todoTasks.indexOf(currentItem), 1, task);
      localStorage.storageTasks = JSON.stringify(todoTasks);
      return todoTasks;
    },
  }
}