import gql from 'graphql-tag'

export const todoItemsQuery = gql`
  {
    task @client {
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
// export const checkItemMutation = gql`
//   mutation($id: ID!) {
//     checkItem(id: $id) @client
//   }
// `;
export const deleteItemMutation = gql`
  mutation($idTask: ID!) {
    deleteItem(idTask: $idTask) @client
  }
`;
export const addItemMutation = gql`
  mutation($idTask: ID!) {
    addItem(idTask: $idTask) @client {
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
  mutation($task: Task!, $id: ID!) {
    saveTask(task: $task, id: $id) @client {
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