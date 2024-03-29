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
export const addItemMutation = gql`
  mutation($idTask: ID!) {
    addTask(idTask: $idTask) @client {
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
  mutation($task: Task!, $idTask: ID!) {
    saveTask(task: $task, idTask: $idTask) @client {
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