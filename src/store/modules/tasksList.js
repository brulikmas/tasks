import { 
  todoItemsQuery, 
  deleteItemMutation,
  saveTaskMutation,
} from '../../graphql/queries';
import apollo from '../../apolloClient.js'

export default {
  namespaced: true,
  state: {
    tasks: [],
    selectedTaskId: null,
  },
  getters: {
    getOneTask(state) {
      const finded = state.tasks.find(item => item.id === state.selectedTaskId);
      return finded; 
    }
  },
  mutations: {
    //в payload во всех мутациях всегда получаем массив заданий
    LOAD_TASKS(state, payload) {
      state.tasks = payload;
      state.selectedTaskId = null;
    },
    CHANGE_SELECTED_TASK_ID(state, id) {
      state.selectedTaskId = id;
    },
  },
  actions: {
    async loadTasks({ commit }) {
      try {
        const response = await apollo.query({
          query: todoItemsQuery,
        });
        commit('LOAD_TASKS', response.data.todoTasks);
      } catch(e) {
        console.log(e);
      }
    },
    async deleteTask( { commit }, payloadId) {
      try {
        const response = await apollo.mutate({
          mutation: deleteItemMutation,
          variables: {
            idTask: payloadId,
          }
        });
        commit('LOAD_TASKS', response.data.deleteTask);
      } catch(e) {
        console.log(e);
      }
    },
    async saveTask( { commit }, payload) {
      try {
        const response = await apollo.mutate({
          mutation: saveTaskMutation,
          variables: {
            task: payload,
          },
        });
        commit('LOAD_TASKS', response.data.saveTask);
      } catch(e) {
        console.log(e);
      }
    },
  },
}