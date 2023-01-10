<template>
  <div>
    {{todoItems}}
  </div>
</template>

<script>
import { todoItemsQuery } from '../graphql/queries';

export default {
  name: 'HelloWorld',
  apollo: {
    todoItems: {
      query: todoItemsQuery,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
