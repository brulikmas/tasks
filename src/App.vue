<template>
  <v-app>
    <Task v-for="(item, index) in task"
      :oneTask="item"
    >
      
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
      task() {
        return {
          query: todoItemsQuery,
        }
      }
    },
    data() {
      return {
        
      }
    },
    updated() {
      this.$apollo.queries.task.skip = true;
      console.log('skiped')
    },
  }
</script>

<style>
</style>
