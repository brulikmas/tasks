<template>
  <v-app>
    <Task v-for="(item, index) in task">
      
    </Task>
  </v-app>
</template>

<script>
  import Task from './components/Task.vue'
  import { 
    todoItemsQuery, 
  } from './graphql/queries';
  export default {
    name: 'App',
    components: {
      Task,
    },
    apollo: {
      task: {
        query: todoItemsQuery,
      }
    },
    data() {
      return {
        newItem: '',
      }
    },
  }
</script>

<style>
</style>
