import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'
import store from './store/index.js'
import apollo from './apolloClient.js'

Vue.prototype.$apollo = apollo;

new Vue({
  render: h => h(App),
  vuetify,
  store
}).$mount('#app')
