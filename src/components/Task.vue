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
                  <template #activator="{ on, attrs }">
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
                        @click="cancelChanges()"
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
                    @click="addToDoItem()"
                  >
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    large
                    color="red"
                    @click="deleteToDoItem(selectedToDoId)"
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
                :doneToDo="item.done"
                :class="{'blue lighten-5': selectedToDoId === item.id}"
                @selectItemInput="selectedToDoId = item.id"
                @taskDone="changeToDoItemDone(item.id)"
                @changeTitle="changeToDoItemText(item.id, $event)"
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
                  <template #activator="{ on, attrs }">
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
      selectedToDoId: null,
      actionsArray: [], //необходим для истории действий
      posForAdd: 0,
      cancelDialog: false,
      cancelEditing: false,
      posForSave: 1,
    }
  },
  created() {
    this.changeActionsArray();
    //Задержка, чтобы функция срабатывала не сразу, при вводе текста
    this.changeTaskTitle = debounce(this.changeTaskTitle, 400); 
    this.changeToDoItemText = debounce(this.changeToDoItemText, 400);
  },
  mounted() {
    //слушаем событие нажатия клавиши и запускаем функцию, необходимо для
    //отмены и повтора выполненых действий клавишами ctrl+z и ctrl+y
    document.addEventListener('keydown', this.keyUpHandler);  
  },
  destroyed() {
    //удаляем слушатель события
    document.removeEventListener('keydown', this.keyUpHandler); 
  },
  computed: {
    ...mapGetters({
      oneTask: 'oneTask/getTask',
    }),
    //свойство для подсчета количества удаляемых элементов в массиве действий
    deleteCountElements() {
      let arrayLength = this.actionsArray.length;
      let deleteCount = arrayLength - this.posForAdd;
      return deleteCount;
    },
    currentTask() {
      let taskObject = {...this.actionsArray[this.posForAdd - 1]}; 
      taskObject.todoItems = [...taskObject.todoItems];
      for(let i = 0; i < taskObject.todoItems.length; i++) {
        taskObject.todoItems[i] = {...taskObject.todoItems[i]}
      };
      return taskObject;
    },
  },
  methods: {
    ...mapMutations({
      changeTask: 'oneTask/CHANGE_TASK',
      changeTaskName: 'oneTask/CHANGE_TASK_NAME',
      addToDo: 'oneTask/ADD_TODO',
      deleteToDo: 'oneTask/DELETE_TODO',
      changeDoneToDo: 'oneTask/CHANGE_DONE_TODO',
      changeTextToDo: 'oneTask/CHANGE_TEXT_TODO',
      changeFlagEdit: 'tasksList/CHANGE_FLAG_EDIT',
    }),
    ...mapActions({
      saveTask: 'tasksList/saveTask',
    }),
    /*
      Добавляет метку(элемент) действия, к которой можно будет вернуться.
      Клонируем с помощью оператора spread, чтобы каждый элемент в массиве 
      действий был уникальным. Пытался сделать через watch, следя за геттером
      oneTask, но на вызов функций повтор/отмена так же срабатывал watch, 
      записывая метку повтора/отмены в массив.
    */ 
    changeActionsArray() {
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
      this.changeTaskName(titleTaskValue);
      this.changeActionsArray();
    }, 
    changeToDoItemDone(id) {
      this.changeDoneToDo(id);
      this.changeActionsArray();
    },
    deleteToDoItem(id) {
      if (id !== null) {
        this.deleteToDo(id);
        this.selectedToDoId = null;
        this.changeActionsArray();
      };
    },
    addToDoItem() {
      this.addToDo();
      this.changeActionsArray();
    },
    changeToDoItemText(id, titleText) {
      this.changeTextToDo({id: id, text: titleText});
      this.changeActionsArray();
    },
    cancelLastChange() {
      if (this.posForAdd > 1) {
        this.posForAdd -= 1;
        this.changeTask(this.currentTask);
      }
    },
    repeatLastChange() {
      if (this.posForAdd < this.actionsArray.length) {
        this.posForAdd += 1;
        this.changeTask(this.currentTask);
      }
    },
    //проверяем нажатие пользователем комбинации клавиш ctrl+z и ctrl+y
    //и предотвращаем стандартное поведение инпутов на эти комбинации,
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
      //меняем позицию сохрания, чтобы при нажатии кнопки "отмена",
      //был сброс данных до этой позиции
      this.posForSave = this.posForAdd;
      this.saveTask({ savedTask: taskForSave, savedId: taskId});
    },
    cancelChanges() {
      this.actionsArray.splice(this.posForSave, this.actionsArray.length);
      this.posForAdd = this.posForSave;
      this.changeTask(this.currentTask);
      this.cancelDialog = false;
      this.changeFlagEdit();
    },
  },
}
</script>
  
<style scoped>
  .v-subheader {
    font-size: 1rem;
  }

</style>
