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
              <v-btn
                icon
                large
                color="green"
                @click="addTask()"
              >
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
              <v-dialog
                persistent
                max-width="1000px"
                v-model="cancelEditDialog"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    large
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!selectedItemTask"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <Task
                  :key="cancelEditDialog"
                  @cancel="cancelEditDialog = false"
                >
                </Task>
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
                    :disabled="!selectedItemTask"
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
                      @click="deleteTaskMethod(selectedItemTask)"
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
        cancelEditDialog: false,
      }
    },
    computed: {
      ...mapGetters({
        task: 'tasksList/getTasks',
        selectedItemTask: 'tasksList/getSelectedTask',
      })
    },
    created() {
      this.load();
    },
    methods: {
      ...mapActions({
        load: 'tasksList/loadTasks',
        addTask: 'tasksList/addNewTask',
        deleteTask: 'tasksList/deleteTaskFrom'
      }),
      ...mapMutations({
        selectItemTask: 'tasksList/SELECT_TASK',
      }),
      deleteTaskMethod(id) {
        if (id !== null) {
          this.deleteTask(id);
          this.selectItemTask(null);
          this.cancelDialog = false;
        }
      },
    }
  }
</script>

<style>

</style>
