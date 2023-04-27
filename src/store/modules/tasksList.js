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
    selectedTaskId: null,
    updateKey: 0, //для перерендеринга компонента Task
  },
  getters: {
    getTasks(state) {
      return state.tasks;
    },
    getUpdateKey(state) {
      return state.updateKey;
    },
    getSelectedTaskId(state) {
      return state.selectedTaskId;
    },
    getOneTask(state) {
      const finded = state.tasks.find(item => item.id === state.selectedTaskId);
      return finded; 
    }
  },
  mutations: {
    //в payload во всех мутациях всегда получаем массив заданий
    LOAD_TASKS(state, payload) {
      state.tasks = payload;
    },
    ADD_TASK(state, payload) { 
      state.tasks = payload;
    },
    DELETE_TASK(state, payload) {
      state.tasks = payload;
      state.selectedTaskId = null;
    },
    CHANGE_SELECTED_TASK_ID(state, id) {
      state.selectedTaskId = id;
    },
    SAVE_TASK(state, payload) {
      state.tasks = payload;
    },
    CHANGE_UPDATE_KEY(state) {
      state.updateKey++;
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
    async addNewTask({ commit, getters }, payloadId) {
      try {
        const response = await apollo.mutate({
          mutation: addItemMutation,
          variables: {
            idTask: payloadId,
          }
        });
        commit('ADD_TASK', response.data.addTask);
        commit('CHANGE_SELECTED_TASK_ID', payloadId);
        commit('oneTask/SET_ONETASK_FROM_TASKLIST', getters.getOneTask, { root: true });
        commit('CHANGE_UPDATE_KEY');
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
            idTask: payload.savedId,
          },
        });
        commit('SAVE_TASK', response.data.saveTask);
      } catch(e) {
        console.log(e);
      }
    },
  },
}