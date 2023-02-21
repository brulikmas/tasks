<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-card>

            <v-simple-table 
              fixed-header
              height="350px"
            >
              <thead class="mb-2">
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
                >
                  <td class="text-top">
                    <h3>{{ item.name }}</h3>
                  </td>
                  <v-tooltip
                    v-model="show"
                    right
                    color="purple lighten-4"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <td
                          v-bind="attrs" 
                          v-on="on"
                      >
                        <CheckBox v-for="(checkItem, checkIndex) in item.todoItems.slice(0, 2)"
                          :key="checkIndex"
                          :title="checkItem.text"
                          :doneTask="checkItem.done"
                        >
                        </CheckBox>
                        <h3  
                          class="pl-1" 
                          v-if="item.todoItems.length > 2"
                        >
                          ...
                        </h3>
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <template></template>
    <Task v-if="false" v-for="(item, index) in task"
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
        show: false,
      }
    },
    updated() {
      this.$apollo.queries.task.skip = true;
      console.log('skiped')
    },
    methods: {

    }
  }
</script>

<style>
  td {
    height: 50px !important;
  }
</style>
