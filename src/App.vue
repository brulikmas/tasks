<template>
  <v-app>
    <Task>

    </Task>
    
  </v-app>
</template>

<script>
  import Task from './components/Task.vue'
  import { 
    todoItemsQuery, 
    checkItemMutation, 
    deleteItemMutation,
    addItemMutation,
  } from './graphql/queries';
  export default {
    name: 'App',
    components: {
      Task,
    },
    apollo: {
      todoItems: {
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
