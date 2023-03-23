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
        :class="{'blue lighten-5': selectedItemTask === item.id}"
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
</template>

<script>
  import CheckBox from './CheckBox.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'TaskList',
    components: {
      CheckBox,
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters({
        tasks: 'tasksList/getTasks',
        selectedItemTask: 'tasksList/getSelectedTask',
        oneTask: 'tasksList/getOneTask',
      })
    },
    methods: {
      ...mapMutations({
        selectItemTask: 'tasksList/SELECT_TASK',
        setOneTask: 'oneTask/SET_ONETASK',
      }),
      selectTask(id) {
        if(id !== this.selectedItemTask) {
          this.selectItemTask(id);
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