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
                v-model="flagDialog"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    large
                    color="green"
                    @click="addTaskMethod()"
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
                <Task :key="updateKey"></Task>
              </v-dialog>
              <v-dialog
                v-model="cancelDialog"
                persistent
                max-width="350"
              >
                <template v-slot:activator="{ on, attrs }">
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
                      @click="deleteTaskMethod(selectedItemTaskId)"
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
  import { mapActions, mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'App',
    components: {
      Task,
      TaskList,
    },
    data() {
      return {
        cancelDialog: false, 
      }
    },
    computed: {
      ...mapGetters({
        tasks: 'tasksList/getTasks',
        selectedItemTaskId: 'tasksList/getSelectedTaskId',
        oneTask: 'tasksList/getOneTask',
        flagDialog: 'tasksList/getFlagEditDialog',
        updateKey: 'tasksList/getUpdateKey',
      }),

    },
    created() {
      this.loadTasks();
    },
    methods: {
      ...mapActions({
        loadTasks: 'tasksList/loadTasks',
        addTask: 'tasksList/addNewTask',
        deleteTask: 'tasksList/deleteTask'
      }),
      ...mapMutations({
        changeSelectedTaskId: 'tasksList/CHANGE_SELECTED_TASK_ID',
        setOneTask: 'oneTask/SET_ONETASK_FROM_TASKLIST',
        changeFlagEdit: 'tasksList/CHANGE_FLAG_EDIT',
        changeUpdateKey: 'tasksList/CHANGE_UPDATE_KEY',
      }),
      deleteTaskMethod(id) {
        if (id !== null) {
          this.deleteTask(id);
          this.cancelDialog = false;
        }
      },
      addTaskMethod() {
        let idNewTask = Date.now();
        this.addTask(idNewTask);
      },
      openEdit() {
        this.changeFlagEdit();
        this.changeUpdateKey(); 
      },
    }
  }
</script>

<style>

</style>
