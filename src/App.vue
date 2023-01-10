<template>
  <div>
    <CheckBox v-for="(item, index) in todoItems"
      :key="index"
      :title="item.text"
      :doneTask="item.done"
      :id="item.id"
      @taskDone="checkItem(item.id)"
      @delete="deleteItem(item.id)"
    >
    </CheckBox>
    <input 
      type="text"
      :value="newItem"
      @change="addItem(newItem = $event.target.value)"
    >
    
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue';
  import CheckBox from './components/CheckBox.vue';
  import { 
    todoItemsQuery, 
    checkItemMutation, 
    deleteItemMutation,
    addItemMutation,
  } from './graphql/queries';

  export default {
    name: 'App',
    components: {
      HelloWorld,
      CheckBox,
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
    methods: {
      checkItem(id) {
        this.$apollo.mutate({
          mutation: checkItemMutation,
          variables: { id }
        });
      },
      deleteItem(id) {
        this.$apollo.mutate({
          mutation: deleteItemMutation,
          variables: { id }
        });
      },
      addItem(newText) {
        if (newText) {
          this.$apollo.mutate({
            mutation: addItemMutation,
            variables: { text: newText }
          });
          this.newItem = "";
        };
      }
    }
  }
</script>

<style>

</style>
