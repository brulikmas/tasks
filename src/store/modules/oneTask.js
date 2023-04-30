export default {
  namespaced: true,
  state: {
    oneTask: {},
  },
  mutations: {
    SET_ONETASK_FROM_TASKLIST(state, oneTaskFromTaskList) {
      state.oneTask = structuredClone(oneTaskFromTaskList);
    },
    CHANGE_TASK(state, task) {
      state.oneTask = task;
    },
    CHANGE_TASK_NAME(state, nameTask) {
      state.oneTask.name = nameTask;
    },
    ADD_TODO(state) {
      const newItem = {
        __typename: 'Item',
        id: Date.now(),
        text: '',
        done: false,
      };
      state.oneTask.todoItems.push(newItem);
    },
    DELETE_TODO(state, idToDoItem) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === idToDoItem);
      arrayToDo.splice(arrayToDo.indexOf(currentItem), 1); 
    },
    CHANGE_DONE_TODO(state, idToDoItem) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === idToDoItem);
      currentItem.done = !currentItem.done;
    },
    CHANGE_TEXT_TODO(state, payload) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === payload.id);
      currentItem.text = payload.text;
    }
  },
}