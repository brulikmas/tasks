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
              :value="oneTaskFromProp.name"
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
        <CheckBox v-for="(item, index) in oneTaskFromProp.todoItems"
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
                @click="saveChanges(oneTaskFromProp, oneTaskFromProp.id)"
              >
                Сохранить
              </v-btn>
              <v-dialog
                v-model="cancelDialog"
                persistent
                max-width="350"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                  >
                    Отмена
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Вы действительно хотите <br> отменить изменения?
                  </v-card-title>
                  <v-card-text>
                    Все несохраненные данные будут потеряны.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      @click="cancelChanges()"
                    >
                      Да
                    </v-btn>
                    <v-btn
                      text
                      @click="cancelDialog = false"
                    >
                      Нет
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
      oneTaskFromProp: this.oneTask,
      selectedItemId: null,
      actionsArray: [],
      posForAdd: 0,
      cancelDialog: false,
      posForSave: 1,
    }
  },
  mounted() {
    this.changeActionsArray();
    document.addEventListener('keyup', this.keyUpHandler);
  },
  destroyed() {
    document.removeEventListener('keyup', this.keyUpHandler);
  },
  computed: {
    deleteCountElements() {
      let arrayLength = this.actionsArray.length;
      let deleteCount = arrayLength - this.posForAdd;
      return deleteCount;
    },
    currentArray() {
      let array = {...this.actionsArray[this.posForAdd - 1]};
      array.todoItems = [...array.todoItems];
      for(let i = 0; i < array.todoItems.length; i++) {
        array.todoItems[i] = {...array.todoItems[i]}
      };
      return array;
    },
  },
  methods: {
    changeActionsArray() {
      let addNewElement = {...this.oneTaskFromProp};
      addNewElement.todoItems = [...addNewElement.todoItems];
      for (let i = 0; i < addNewElement.todoItems.length; i++) {
        addNewElement.todoItems[i] = {...addNewElement.todoItems[i]};
      };
      if (this.posForAdd === this.actionsArray.length) {
        this.posForAdd += 1;
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
      }
      else {
        console.log(addNewElement);
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
        this.posForAdd += 1;
      }
    },
    changeTaskTitle(titleTaskValue) {
      this.oneTaskFromProp.name = titleTaskValue;
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
        const currentItem = this.oneTaskFromProp.todoItems.find(item => item.id === id);
        this.oneTaskFromProp.todoItems.splice(this.oneTaskFromProp.todoItems.indexOf(currentItem), 1);
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
      this.oneTaskFromProp.todoItems.push(newItem);
      this.changeActionsArray();
    },
    changeTextTitle(checkBoxTask, titleText) {
      checkBoxTask.text = titleText;
      this.changeActionsArray();
    },
    cancelLastChange() {
      if (this.posForAdd > 1) {
        this.posForAdd -= 1;
        // let currentArray = {...this.actionsArray[this.posForAdd - 1]};
        // currentArray.todoItems = [...currentArray.todoItems];
        // for(let i = 0; i < currentArray.todoItems.length; i++) {
        //   currentArray.todoItems[i] = {...currentArray.todoItems[i]}
        // };
        this.oneTaskFromProp = this.currentArray;
      }
    },
    repeatLastChange() {
      if (this.posForAdd < this.actionsArray.length) {
        this.posForAdd += 1;
        // let currentArray = {...this.actionsArray[this.posForAdd - 1]};
        // currentArray.todoItems = [...currentArray.todoItems];
        // for(let i = 0; i < currentArray.todoItems.length; i++) {
        //   currentArray.todoItems[i] = {...currentArray.todoItems[i]}
        // };
        this.oneTaskFromProp = this.currentArray;
      }
    },
    keyUpHandler(event) {
      if (event.ctrlKey && (event.key === 'z' || event.key === 'я')) {
        this.cancelLastChange();
      }
      else if (event.ctrlKey && (event.key === 'y' || event.key === 'н')) {
        this.repeatLastChange();
      };
    },
    saveChanges(taskForSave, taskId) {
      this.posForSave = this.posForAdd;
      this.$apollo.mutate({
        mutation: saveTaskMutation,
        variables: {taskForSave, taskId},
      });
    },
    cancelChanges() {
      console.log(this.posForSave);
      this.actionsArray.splice(this.posForSave, this.actionsArray.length);
      this.posForAdd = this.posForSave;
      // let currentArray = {...this.actionsArray[this.posForSave - 1]};
      // currentArray.todoItems = [...currentArray.todoItems];
      // for(let i = 0; i < currentArray.todoItems.length; i++) {
      //   currentArray.todoItems[i] = {...currentArray.todoItems[i]}
      // };
      this.oneTaskFromProp = this.currentArray;
      this.cancelDialog = false;
    },
  },
}
</script>
  
<style scoped>
  .v-subheader {
    font-size: 1.2rem;
  }
</style>
