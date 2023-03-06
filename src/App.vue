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
                @click="addNewTask()"
              >
                <v-icon>
                  mdi-plus-box
                </v-icon>
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
                    <v-icon>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <Task
                  v-if="focused !== null && task.length !== 0"
                  :key="task[focused].id"
                  :oneTask="task[focused]"
                  :cancelTask="cancelEditDialog"
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
                    <v-icon>
                      mdi-delete-outline
                    </v-icon>
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
                      @click="deleteItemTask(selectedItemTask)"
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
              <v-simple-table 
                fixed-header
                height="600px"
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      <h2>Задание</h2>
                    </th>
                    <th class="text-left">
                      <h2>Задачи</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in task"
                    :key="index"
                    @click="selectItemTask(item.id, index)"
                    :class="{'blue lighten-5': focused === index}"
                  >
                    <td>
                      <h3>{{ item.name }}</h3>
                    </td>
                    <td>
                      <CheckBox v-for="(checkItem, checkIndex) in item.todoItems.slice(0, 2)"
                        :key="checkItem.id"
                        :title="checkItem.text"
                        :doneTask="checkItem.done" 
                        :activated="true"
                        
                      >
                      </CheckBox>
                      <v-tooltip
                        v-if="item.todoItems.length > 2"
                        bottom
                        color="blue lighten-4"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn    
                            class="px-0"
                            style="justify-content: start;"
                            v-bind="attrs" 
                            v-on="on"
                            plain
                          >
                            ...
                        </v-btn>
                        </template>
                        <CheckBox v-for="(checkItem, checkIndex) in item.todoItems"
                            :key="checkIndex"
                            :title="checkItem.text"
                            :doneTask="checkItem.done"
                          >
                        </CheckBox>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import Task from './components/Task.vue';
  import CheckBox from './components/CheckBox.vue';

  import { 
    todoItemsQuery, 
    addItemMutation,
    deleteItemMutation
  } from './graphql/queries';

  export default {
    name: 'App',
    components: {
      Task,
      CheckBox,
    },
    apollo: {
      task() {
        return {
          query: todoItemsQuery,
        }
      }
    },
    data() {
      return {
        selectedItemTask: null,
        focused: null,
        cancelDialog: false,
        cancelEditDialog: false,
      }
    },
    beforeUpdate() {
      //this.$apollo.queries.task.skip = true; //аполло перестает делать запрос, чтобы изменяемые данные не сбрасывались в компоненте
      console.log('skiped')
    },
    methods: {
      selectItemTask(id, focusIndex) {
        console.log("Айди: " + id);
        this.selectedItemTask = id;
        this.focused = focusIndex;
      },
      deleteItemTask(id) {
        console.log(id);
        if (id !== null) {
          this.$apollo.mutate({
            mutation: deleteItemMutation,
            variables: {
              idTask: id,
            }
          });
          this.focused = 0;
          this.selectedItemTask = null;
          this.cancelDialog = false;
        }
        //this.$apollo.queries.task.skip = false; //делаем запрос, чтобы видеть изменения после мутации
      },
      addNewTask() {
        this.$apollo.mutate({
          mutation: addItemMutation,
          variables: {
            idTask: Date.now(),
          }
        });
        //this.$apollo.queries.task.skip = false; //делаем запрос, чтобы видеть изменения после мутации
      },
    }
  }
</script>

<style>
  td, th {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  };
</style>
