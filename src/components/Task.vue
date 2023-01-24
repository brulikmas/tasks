<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="1000"
    >
      <v-card-title >
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
              v-model="oneTask.name"
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
        <CheckBox v-for="(item, index) in oneTask.todoItems"
          :key="index"
          :title="item.text"
          :doneTask="item.done"
          :id="item.id"
          @selectItemInput="selectItem(item.id)"
          @taskDone="checkItem(item)"
          @changeTitle="changeTextTitle(item, $event)"
        >
        </CheckBox>
     
        <v-card-actions>
          <v-row>
            <v-col
              cols="4"
              class="px-0"
              offset-md="7"
            >
              <v-btn
                icon
              >
                <v-icon>
                  mdi-undo-variant
                </v-icon>
              </v-btn>
              <v-btn
                icon
                class="mr-3"
              >
                <v-icon>
                  mdi-redo-variant
                </v-icon>
              </v-btn>
              <v-btn
                color="green"
                class="white--text mr-3"
                @click="saveChanges(oneTask, oneTask.id)"
              >
                Сохранить
              </v-btn>
              <v-btn
                
              >
                Отмена
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
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
    saveTaskMutation,
  } from '../graphql/queries';
import shortid from 'shortid';

export default {
  name: 'Task',
  components: {
    CheckBox,
  },
  props: {
    oneTask: Object, 
  },
  apollo: {
    task: {
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
    checkItem(checkBoxTask) {
      checkBoxTask.done = !checkBoxTask.done;
    },
    deleteItem(id) {
      if (id !== null) {
        const currentItem = this.oneTask.todoItems.find(item => item.id === id);
        this.oneTask.todoItems.splice(this.oneTask.todoItems.indexOf(currentItem), 1);
        this.selectedItemId = null;
      };
    },
    addItem() {
      const newItem = {
        __typename: 'Item',
        id: shortid.generate(),
        text: 'Введите задачу',
        done: false,
      };
      this.oneTask.todoItems.push(newItem);
    },
    changeTextTitle(checkBoxTask, titleText) {
      checkBoxTask.text = titleText;
    },
    saveChanges(taskForSave, taskId) {
      this.$apollo.mutate({
        mutation: saveTaskMutation,
        variables: {taskForSave, taskId},
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
