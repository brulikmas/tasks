import Vue from 'vue'
import Vuex from 'vuex'
import tasksList from './modules/tasksList'
import oneTask from './modules/oneTask'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { 
    tasksList, 
    oneTask,
  },
  getters: {

  }
})