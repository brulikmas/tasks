<template>
  <div>
    <v-row justify="center">
      <v-col cols="1">
        <v-checkbox 
          :input-value="doneTask" 
          @change="$emit('taskDone')"
          color="success"
        >
        </v-checkbox>
      </v-col>
      <v-col cols="9">
        <v-text-field
          outlined 
          :value="title"
          @focus="$emit('selectItemInput')"
          @input="$emit('changeTitle', $event)"
        >
        </v-text-field>
      </v-col>
     
    </v-row>
  </div>
</template>

<script>

export default {
  name: 'CheckBox',
  props: {
    id: String,
    title: String,
    doneTask: Boolean,
  },
  data() {
    return {
     
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
