const check = localStorage.getItem('storageTasks');
export const todoTasks = [];
if (check === null) {
    const startTask = {
      __typename: 'Task',
      id: '1',
      name: 'Задание 1',
      todoItems: [{
        __typename: 'ToDo',
        id: '1', 
        text: '',       
        done: false,
      }],
    };
    todoTasks.splice(0, 1, startTask);
    localStorage.storageTasks = JSON.stringify(todoTasks);
} else {
  let storageTasks = JSON.parse(check);
  todoTasks.splice(0, 1, ...storageTasks);
}