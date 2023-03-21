<template>
    <v-card>
      <v-card-title>
        Редактирование задания
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-dialog
                  v-model="cancelEditing"
                  persistent
                  max-width="450"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      large
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">
                      Вы действительно хотите  закрыть окно редактирования?
                    </v-card-title>
                    <v-card-text>
                      Все несохраненные данные будут потеряны.
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        @click="cancelEdit()"
                      >
                        Да
                      </v-btn>
                      <v-btn
                        text
                        @click="cancelEditing = false"
                      >
                        Нет
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
        </v-card-actions>
      </v-card-title>
      <v-card-text> 
          <v-row>
            <v-col
              cols="12"
              sm="2"
            >
              <v-subheader class="pa-0">Задание:</v-subheader>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <v-textarea
                outlined
                no-resize
                :value="oneTask.name"
                @input="changeTaskTitle($event)"
              >    
              </v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="py-0 pl-0">
            <v-row>
              <v-col 
                cols="4"
                sm="2"
              >
                <v-subheader class="pa-0">Список задач:</v-subheader>
              </v-col>
              <v-col 
                class="pl-0"                
              >
                  <v-btn
                    icon
                    large
                    color="green"
                    @click="addItem()"
                  >
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    large
                    color="red"
                    @click="deleteItem(selectedItemId)"
                  >
                    <v-icon>
                      mdi-delete-outline
                    </v-icon>
                  </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-row 
            justify="center"
            class="my-2"
          >
            <v-col
              class="overflow-y-scroll overflow-x-hidden pr-sm-0 pr-4 py-2 my-2"
              style="max-height: 300px;"
              cols="10" 
            >
              <CheckBox v-for="(item, index) in oneTask.todoItems"
                :key="index"
                :title="item.text"
                :doneTask="item.done"
                :class="{'blue lighten-5': selectedItemId === item.id}"
                @selectItemInput="selectedItemId = item.id"
                @taskDone="checkItem(item)"
                @changeTitle="changeTextTitle(item, $event)"
              >
              </CheckBox>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col
              cols="12"
              sm="10"
            >
              <v-card-actions class="pr-0">
                <v-spacer></v-spacer>
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
              </v-card-actions>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
</template>

<script>

import CheckBox from './CheckBox.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import debounce from 'debounce';

export default {
  name: 'Task',
  components: {
    CheckBox,
  },
  data() {
    return {
      selectedItemId: null,
      actionsArray: [],
      posForAdd: 0,
      cancelDialog: false,
      cancelEditing: false,
      posForSave: 1,
    }
  },
  created() {
    this.changeActionsArray();
    this.changeTaskTitle = debounce(this.changeTaskTitle, 400);
    this.changeTextTitle = debounce(this.changeTextTitle, 400);
  },
  mounted() {
    document.addEventListener('keydown', this.keyUpHandler);
  },
  destroyed() {
    document.removeEventListener('keydown', this.keyUpHandler);
  },
  computed: {
    ...mapGetters({
      oneTask: 'oneTask/getTask',
    }),
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
    ...mapMutations({
      setTask: 'oneTask/SET_TASK',
      changeName: 'oneTask/CHANGE_NAME',
      addToDo: 'oneTask/ADD_ITEM',
      deleteToDo: 'oneTask/DELETE_ITEM',
    }),
    ...mapActions({
      saveTask: 'tasksList/saveTask',
    }),
    changeActionsArray() {
      console.log("change");
      let addNewElement = {...this.oneTask};
      addNewElement.todoItems = [...addNewElement.todoItems];
      for (let i = 0; i < addNewElement.todoItems.length; i++) {
        addNewElement.todoItems[i] = {...addNewElement.todoItems[i]};
      };
      if (this.posForAdd === this.actionsArray.length) {
        this.posForAdd += 1;
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
      }
      else {
        this.actionsArray.splice(this.posForAdd, this.deleteCountElements, addNewElement);
        this.posForAdd += 1;
      }
    },
    changeTaskTitle(titleTaskValue) {
      console.log("change name");
      this.changeName(titleTaskValue);
      this.changeActionsArray();
    }, 
    checkItem(checkBoxTask) {
      checkBoxTask.done = !checkBoxTask.done;
      this.changeActionsArray();
    },
    deleteItem(id) {
      if (id !== null) {
        this.deleteToDo(id);
        this.selectedItemId = null;
        this.changeActionsArray();
      };
    },
    addItem() {
      this.addToDo();
      this.changeActionsArray();
    },
    changeTextTitle(checkBoxTask, titleText) {
      checkBoxTask.text = titleText;
      this.changeActionsArray();
    },
    cancelLastChange() {
      if (this.posForAdd > 1) {
        console.log('cancel');
        this.posForAdd -= 1;
        this.setTask(this.currentArray);
      }
    },
    repeatLastChange() {
      if (this.posForAdd < this.actionsArray.length) {
        console.log('repeat');
        this.posForAdd += 1;
        this.setTask(this.currentArray);
      }
    },
    keyUpHandler(event) {
      if (event.ctrlKey && (event.key === 'z' || event.key === 'я')) {
        event.preventDefault();
        this.cancelLastChange();
      }
      else if (event.ctrlKey && (event.key === 'y' || event.key === 'н')) {
        event.preventDefault();
        this.repeatLastChange();
      };
    },
    saveChanges(taskForSave, taskId) {
      this.posForSave = this.posForAdd;
      this.saveTask({ savedTask: taskForSave, savedId: taskId});
    },
    cancelChanges() {
      this.actionsArray.splice(this.posForSave, this.actionsArray.length);
      this.posForAdd = this.posForSave;
      this.setTask(this.currentArray);
      this.cancelDialog = false;
    },
    cancelEdit() {
      this.cancelChanges();
      this.$emit('cancel');
    }
  },
}
</script>
  
<style scoped>
  .v-subheader {
    font-size: 1rem;
  }

</style>
