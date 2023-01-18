<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-title
        
      >
        Редактирование задания
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn
            icon
            large
          >
            <v-icon>
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col cols="2">
            <v-subheader>Задание:</v-subheader>
          </v-col>
          <v-col cols="9">
            <v-textarea
              outlined
              no-resize
              value="Задание 1"
            >
            
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col 
            cols="2"
            class="pr-0"  
          >
            <v-subheader
              class="pr-0"
            >
              Список задач:
            </v-subheader>
          </v-col>
          <v-col class="pl-0">
            <v-card-actions class="py-0 pl-0">
              <v-btn
                icon
                large
                class="px-0"
                color="green"
                @click="addItem()"
              >
                <v-icon>
                  mdi-plus-box
                </v-icon>
              </v-btn>
              <v-btn
                icon
                large
                class="px-0"
                color="red"
                @click="deleteItem(selectedItemId)"
              >
                <v-icon>
                  mdi-delete-outline
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <CheckBox v-for="(item, index) in todoItems"
        :key="index"
        :title="item.text"
        :doneTask="item.done"
        :id="item.id"
        @selectItemInput="selectItem(item.id)"
        @taskDone="checkItem(item.id)"
        >

      </CheckBox>
      </v-container>
    </v-card>
  </div>
</template>

<script>

import CheckBox from './CheckBox.vue';
import { 
    todoItemsQuery, 
    checkItemMutation, 
    deleteItemMutation,
    addItemMutation,
  } from '../graphql/queries';

export default {
  name: 'Task',
  components: {
    CheckBox,
  },
  apollo: {
    todoItems: {
      query: todoItemsQuery,
    }
  },
  data() {
    return {
      selectedItemId: null,
    }
  },
  methods: {
    selectItem(id) {
      this.selectedItemId = id;
    },  
    checkItem(id) {
      this.$apollo.mutate({
        mutation: checkItemMutation,
        variables: { id }
      });
    },
    deleteItem(id) {
      if (id !== null) {
        this.$apollo.mutate({
          mutation: deleteItemMutation,
          variables: { id }
        });
        this.selectedItemId = null;
      };
    },
    addItem() {
      this.$apollo.mutate({
        mutation: addItemMutation,
        variables: { text: "Введите задачу" }
      });
    }
  },
}
</script>
  
<style scoped>
  .v-subheader {
    font-size: 1.2rem;
  }
</style>
