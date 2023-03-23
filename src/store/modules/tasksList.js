import { 
  todoItemsQuery, 
  addItemMutation,
  deleteItemMutation,
  saveTaskMutation,
} from '../../graphql/queries';
import apollo from '../../apolloClient.js'

export default {
  namespaced: true,
  state: {
    tasks: [],
    selectedTask: null,
  },
  getters: {
    getTasks(state) {
      return state.tasks;
    },
    getSelectedTask(state) {
      return state.selectedTask;
    },
    getOneTask(state) {
      const finded = state.tasks.find(item => item.id === state.selectedTask);
      return finded; 
    }
  },
  mutations: {
    SET_TASKS(state, payload) {
      state.tasks = payload;  //в payload во всех мутациях всегда получаем массив заданий
    },
    ADD_TASK(state, payload) { 
      state.tasks = payload;
    },
    DELETE_TASK(state, payload) {
      state.tasks = payload;
      state.selectedTask = null;
    },
    SELECT_TASK(state, payload) {
      state.selectedTask = payload;
    },
    SAVE_TASK(state, payload) {
      state.tasks = payload;
    },
  },
  actions: {
    async loadTasks({ commit }) {
      try {
        const response = await apollo.query({
          query: todoItemsQuery,
        });
        commit('SET_TASKS', response.data.todoTasks); 
      } catch(e) {
        console.log(e);
      }
    },
    async addNewTask({ commit }) {
      try {
        const response = await apollo.mutate({
          mutation: addItemMutation,
          variables: {
            idTask: Date.now(),
          }
        });
        commit('ADD_TASK', response.data.addTask);
      } catch(e) {
        console.log(e);
      }
    },
    async deleteTaskFrom( { commit }, payloadId) {
      try {
        const response = await apollo.mutate({
          mutation: deleteItemMutation,
          variables: {
            idTask: payloadId,
          }
        });
        commit('DELETE_TASK', response.data.deleteTask);
      } catch(e) {
        console.log(e);
      }
    },
    async saveTask( { commit }, payload) {
      try {
        const response = await apollo.mutate({
          mutation: saveTaskMutation,
          variables: {
            task: payload.savedTask,
            id: payload.savedId,
          },
        });
        commit('SAVE_TASK', response.data.saveTask);
      } catch(e) {
        console.log(e);
      }
    },
  },
}