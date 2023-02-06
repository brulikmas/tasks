<template>
  <v-app>
    <Task v-for="(item, index) in task"
      :oneTask="item"
      @cancelChange="cancelLastChange(index, $event)"
      @repeatChange="repeatTaskChange(index, $event)"
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
    methods: {
      cancelLastChange(index, newArray) {
        console.log(newArray);
        console.log('Индекс ' + index);
        this.task.splice(index, 1, newArray);
      },
      repeatTaskChange(index, newArray) {
        this.task.splice(index, 1, newArray); //Может полететь, если будет несколько тасков
      }
    }
  }
</script>

<style>
</style>
