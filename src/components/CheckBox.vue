<template>
  <div>
    <v-row 
      justify="center"  
      class="mt-2"
    >
      <v-col 
        cols="1"
        class="mr-md-3 mr-2"
      >
        <v-checkbox 
          :input-value="doneTask" 
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
          @focus="$emit('selectItemInput')"
          @input="$emit('changeTitle', $event)"
          @keydown.ctrl.90.prevent
          @keydown.ctrl.89.prevent
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
