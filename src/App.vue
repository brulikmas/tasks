<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
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
              <v-btn
                icon
                large
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                icon
                large
                color="red"
                @click="deleteItemTask(selectedItemTask)"
              >
                <v-icon>
                  mdi-delete-outline
                </v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-text>

              <v-simple-table 
                fixed-header
                min-height="350px"
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
                    @click="selectItemTask(item.id)"
                  >
                    <td>
                      <h3>{{ item.name }}</h3>
                    </td>
                    <v-tooltip
                      v-model="show"
                      start
                      color="purple lighten-4"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <td>
                          <CheckBox v-for="(checkItem, checkIndex) in item.todoItems.slice(0, 2)"
                            :key="checkIndex"
                            :title="checkItem.text"
                            :doneTask="checkItem.done" 
                          >
                          </CheckBox>
                          <v-btn  
                            v-if="item.todoItems.length > 2"
                            class="px-0"
                            style="justify-content: start;"
                            v-bind="attrs" 
                            v-on="on"
                            plain
                            @click="show = !show"
                          >
                            ...
                        </v-btn>
                        </td>
                      </template>
                      <CheckBox v-for="(checkItem, checkIndex) in item.todoItems"
                          :key="checkIndex"
                          :title="checkItem.text"
                          :doneTask="checkItem.done"
                        >
                      </CheckBox>
                    </v-tooltip>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <template></template>
    <Task v-if="true" v-for="(item, index) in task"
      :oneTask="item"
    >
      
    </Task>
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
  import shortid from 'shortid';

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
        show: false,
        selectedItemTask: null,
      }
    },
    updated() {
      this.$apollo.queries.task.skip = true; //аполло перестает делать запрос, чтобы изменяемые данные не сбрасывались в компоненте
      console.log('skiped')
    },
    methods: {
      selectItemTask(id) {
        console.log("Айди: " + id);
        this.selectedItemTask = id;
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
          this.selectedItemTask = null;
        }
        this.$apollo.queries.task.skip = false; //делаем запрос, чтобы видеть изменения после мутации
      },
      addNewTask() {
        this.$apollo.mutate({
          mutation: addItemMutation,
          variables: {
            idTask: shortid.generate(),
          }
        });
        this.$apollo.queries.task.skip = false; //делаем запрос, чтобы видеть изменения после мутации
      },
    }
  }
</script>

<style>
  td, th {
    height: 50px !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  };
</style>
