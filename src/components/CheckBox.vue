<template>
  <div class="radius pt-2 pl-2" @click="$emit('selectItemInput')">
    <v-form :disabled="disabled">
      <v-row 
        justify="center"  
        class="mt-2"
      >
        <v-col 
          cols="1"
          class="mr-md-3 mr-2"
        >
          <v-checkbox 
            :input-value="doneToDo" 
            @change="$emit('taskDone')"
            color="success"
          >
          </v-checkbox>
        </v-col>
        <v-col 
          class="pr-4 pb-0"
        >
          <v-text-field
            outlined 
            :value="title"
            @input="$emit('changeTitle', $event)"
            placeholder="Введите задачу"
          >
          </v-text-field>
        </v-col>     
      </v-row>

    </v-form>
  </div>
</template>

<script>

export default {
  name: 'CheckBox',
  props: {
    title: String,
    doneToDo: Boolean,
    disabled: Boolean,
  },
  emits: ['changeTitle', 'selectItemInput'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .radius {
    border-radius: 10px;
  }
</style>
