<template>
  <v-app>
    <v-container>
      <v-row style="height: 100vh;">
        <v-col
          align-self="center"
        >
          <v-card>
            <v-card-title>Список заданий</v-card-title>
            <v-card-actions>
              <v-dialog
                persistent
                max-width="1000px"
                v-model="isEditTaskDialogShown"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    large
                    color="green"
                    @click="addTask()"
                  >
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    large
                    :disabled="!selectedItemTaskId"
                    @click="openEdit()"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <Task 
                  :key="updateKey"
                  @cancelEditing="isEditTaskDialogShown = false"
                >
                </Task>
              </v-dialog>
              <v-dialog
                v-model="isDeleteDialogShown"
                persistent
                max-width="350"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    large
                    color="red"
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!selectedItemTaskId"
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Вы действительно хотите <br> удалить задание?
                  </v-card-title>
                  <v-card-text>
                    Все данные будут безвозвратно удалены.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      @click="deleteTaskFromTaskList()"
                    >
                      Да
                    </v-btn>
                    <v-btn
                      text
                      @click="isDeleteDialogShown = false"
                    >
                      Нет
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
            <v-card-text>
              <TaskList></TaskList>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import Task from './components/Task.vue';
  import TaskList from './components/TaskList.vue';
  import { mapActions, mapMutations, mapState } from 'vuex';

  export default {
    name: 'App',
    components: {
      Task,
      TaskList,
    },
    data() {
      return {
        isDeleteDialogShown: false,
        isEditTaskDialogShown: false,
        // Проблема в том, что при закрытии окна редактирования компонент 
        // Task не уничтожается и все его данные в стейте остаются в том 
        // состоянии, в котором они находились до закрытия окна редактирования. 
        // То есть actionsArray при открытии окна редактирования другого задания 
        // имеет в себе элементы таски, которая редактировалось до него. 
        // И в этом случае при нажатии кнопки "назад" или ctrl + z все данные 
        // нашего стейта перезаписываются данными из предыдущего задания, 
        // которое мы редактировали. Поэтому я решил делать ререндер компонента 
        // через updateKey, каждый раз когда модальное окно открывается. 
        updateKey: 0,
      }
    },
    computed: {
      ...mapState('tasksList', {
        selectedItemTaskId: 'selectedTaskId',
      }),
    },
    created() {
      this.loadTasks();
    },
    methods: {
      ...mapActions({
        loadTasks: 'tasksList/loadTasks',
        deleteTask: 'tasksList/deleteTask'
      }),
      ...mapMutations({
        setOneTask: 'oneTask/SET_ONETASK_FROM_TASKLIST',
      }),
      deleteTaskFromTaskList() {
        if (this.selectedItemTaskId !== null) {
          this.deleteTask(this.selectedItemTaskId);
          this.isDeleteDialogShown = false;
        }
      },
      addTask() {
        const newTask = {
          __typename: 'Task',
          id: Date.now(),
          name: `Введите задание`,
          todoItems: [{
            __typename: 'ToDo',
            id: Date.now(),
            text: '',
            done: false,
          }],
        };
        this.setOneTask(newTask);
        this.updateKey++;
        this.isEditTaskDialogShown = true;
      },
      openEdit() {
        this.updateKey++;
        this.isEditTaskDialogShown = true;
      },
    }
  }
</script>

<style>

</style>
