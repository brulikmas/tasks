<template>
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
        v-for="(item, index) in tasks"
        :key="index"
        @click="selectTask(item.id)"
        :class="{'blue lighten-5': selectedTaskId === item.id}"
      >
        <td>
          <h3>{{ item.name }}</h3>
        </td>
        <td>
          <CheckBox v-for="(checkItem, checkIndex) in item.todoItems.slice(0, 2)"
            :key="checkItem.id"
            :title="checkItem.text"
            :doneToDo="checkItem.done" 
            :disabled="true"
          >
          </CheckBox>
          <v-tooltip
            v-if="item.todoItems.length > 2"
            bottom
            color="blue lighten-4"
          >
            <template #activator="{ on, attrs }">
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
                :doneToDo="checkItem.done"
              >
            </CheckBox>
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
  import CheckBox from './CheckBox.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'TaskList',
    components: {
      CheckBox,
    },
    computed: {
      ...mapGetters({
        tasks: 'tasksList/getTasks',
        selectedTaskId: 'tasksList/getSelectedTaskId',
        oneTask: 'tasksList/getOneTask',
      })
    },
    methods: {
      ...mapMutations({
        changeSelectedTaskId: 'tasksList/CHANGE_SELECTED_TASK_ID',
        setOneTask: 'oneTask/SET_ONETASK_FROM_TASKLIST',
      }),
      selectTask(id) {
        if(id !== this.selectedTaskId) {
          this.changeSelectedTaskId(id);
          this.setOneTask(this.oneTask);
        }
      },
    },
  }

</script>

<style scoped>
  td, th {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  };
</style>