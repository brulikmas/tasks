export default {
  namespaced: true,
  state: {
    oneTask: {},
  },
  getters: {
    getTask(state) {
      return state.oneTask;
    }
  },
  mutations: {
    SET_ONETASK(state, payload) {
      state.oneTask = structuredClone(payload);
    },
    SET_TASK(state, payload) {
      state.oneTask = payload;
    },
    CHANGE_NAME(state, payload) {
      state.oneTask.name = payload;
    },
    ADD_ITEM(state) {
      const newItem = {
        __typename: 'Item',
        id: Date.now(),
        text: '',
        done: false,
      };
      state.oneTask.todoItems.push(newItem);
    },
    DELETE_ITEM(state, payload) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === payload);
      arrayToDo.splice(arrayToDo.indexOf(currentItem), 1); 
    },
    CHECK_ITEM(state, payload) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === payload);
      currentItem.done = !currentItem.done;
    },
    CHANGE_TEXT_TODO(state, payload) {
      const arrayToDo = state.oneTask.todoItems;
      const currentItem = arrayToDo.find(item => item.id === payload.id);
      currentItem.text = payload.text;
    }
  },
  actions: {
    
  },
}