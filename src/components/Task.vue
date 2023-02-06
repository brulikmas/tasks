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
              :value="oneTask.name"
              @change="changeTaskTitle($event)"
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
        {{ oneTask }}
        <h3>Действия</h3> {{ actionsArray }}
        <h3>C какой позиции добавляем</h3>{{ posForAdd }}
        <h3>Количество удаляемых</h3>{{ deleteCountElements }}
     
        <v-card-actions>
          <v-row>
            <v-col
              cols="4"
              class="px-0"
              offset-md="7"
            >
              <v-btn
                icon
                @click="cancelLastChange()"
              >
                <v-icon>
                  mdi-undo-variant
                </v-icon>
              </v-btn>
              <v-btn
                icon
                class="mr-3"
                @click="repeatLastChange()"
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
  data() {
    return {
      selectedItemId: null,
      actionsArray: [],
      posForAdd: 0,
    }
  },
  mounted() {
    this.changeActionsArray();
  },
  computed: {
    deleteCountElements() {
      let arrayLength = this.actionsArray.length;
      let deleteCount = arrayLength - this.posForAdd;
      return deleteCount;
    },
  },
  methods: {
    changeActionsArray() {
      console.log('Вызвал');
      let addNewElement = {...this.oneTask};
      addNewElement.todoItems = [...this.oneTask.todoItems];
      for (let i = 0; i < addNewElement.todoItems.length; i++) {
        addNewElement.todoItems[i] = {...this.oneTask.todoItems[i]};
      };
      if (this.posForAdd === this.actionsArray.length) {
        this.posForAdd += 1;
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
        //console.log(addNewElement);
      }
      else {
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
        //console.log(addNewElement);
        this.posForAdd += 1;
      }
    },
    changeTaskTitle(titleTaskValue) {
      this.oneTask.name = titleTaskValue;
      this.changeActionsArray();
    },
    selectItem(id) {
      this.selectedItemId = id;
    },  
    checkItem(checkBoxTask) {
      checkBoxTask.done = !checkBoxTask.done;
      this.changeActionsArray();
    },
    deleteItem(id) {
      if (id !== null) {
        const currentItem = this.oneTask.todoItems.find(item => item.id === id);
        this.oneTask.todoItems.splice(this.oneTask.todoItems.indexOf(currentItem), 1);
        this.selectedItemId = null;
        this.changeActionsArray();
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
      this.changeActionsArray();
    },
    changeTextTitle(checkBoxTask, titleText) {
      checkBoxTask.text = titleText;
      this.changeActionsArray();
    },
    cancelLastChange() {
      if (this.posForAdd > 1) {
        this.posForAdd -= 1;
        this.$emit('cancelChange', this.actionsArray[this.posForAdd - 1]);
        console.log(`after cancel: ${this.posForAdd}`);
      }
    },
    repeatLastChange() {
      if (this.posForAdd < this.actionsArray.length) {
        this.posForAdd += 1;
        this.$emit('repeatChange', this.actionsArray[this.posForAdd - 1]);
        console.log(`after repeat: ${this.posForAdd}`);
      }
    },
    saveChanges(taskForSave, taskId) {
      this.$apollo.mutate({
        mutation: saveTaskMutation,
        variables: {taskForSave, taskId},
      });
    },
  },
}
</script>
  
<style scoped>
  .v-subheader {
    font-size: 1.2rem;
  }
</style>
