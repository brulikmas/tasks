import gql from 'graphql-tag'

export const todoItemsQuery = gql`
  {
    todoTasks @client {
      id
      name
      todoItems {
        id
        text
        done
      }
    }
  }
`;

export const deleteItemMutation = gql`
  mutation deleteTask($idTask: ID!) {
    deleteTask(idTask: $idTask) @client {
      id
      name
      todoItems {
        id
        text
        done
      }     
    }
  }
`;
export const saveTaskMutation = gql`
  mutation($task: Task!) {
    saveTask(task: $task) @client {
      id
      name
      todoItems {
        id 
        text
        done
      }
    }
  }
`;