<template>
  <div>
    <label>
      <input 
        type="checkbox" 
        name="tasks" 
        :value="title" 
        :checked="doneTask"
        @input="$emit('taskDone')"
      >
      {{ title }}
    </label>
    <button @click="$emit('delete')">Delete</button>
    {{  doneTask  }}
  </div>
</template>

<script>

export default {
  name: 'CheckBox',
  props: {
    id: String,
    title: String,
    doneTask: Boolean,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
