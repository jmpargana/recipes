<template>
  <v-container class="form">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col colors="12" md="8">
          <v-text-field
            v-model="name"
            label="Title"
            :rules="[(v) => !!v || 'Title is required']"
            required
          ></v-text-field>
        </v-col>

        <v-col colors="12" md="4">
          <v-text-field
            v-model="time"
            label="Time"
            :rules="[(v) => !!v || 'Time is required']"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-combobox
          class="ingridients"
          multiple
          v-model="ingridients"
          :items="ingridients"
          hide-selected
          chips
          clearable
          label="Ingridients"
          :search-input:sync="search"
        ></v-combobox>
      </v-row>

      <v-row>
        <v-combobox
          class="tags"
          multiple
          v-model="tags"
          :items="tags"
          hide-selected
          chips
          clearable
          label="Tags"
          :search-input:sync="search"
        ></v-combobox>
      </v-row>

      <v-row class="method">
        <v-textarea
          v-model="method"
          solo
          :rules="[(v) => !!v || 'Item is required']"
          label="Method is described here..."
          required
        ></v-textarea>
      </v-row>

      <v-checkbox
        v-model="checkbox"
        label="Should this recipe be private?"
      ></v-checkbox>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Validate
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

      <v-btn color="warning" @click="resetValidation"> Reset Validation </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    title: '',
    method: '',
    time: '',
    ingridients: [],
    tags: [],
    private: false,
    search: null
  }),
  methods: {
    reset () {
      this.title = ''
      this.method = ''
      this.time = ''
      this.ingridients = []
      this.tags = []
      this.private = false
    },
    resetValidation () {},
    submit () {
      axios.post(process.env.API_POST, this.data)
    }
  }
}
</script>

<style scoped>
.form {
  max-width: 800px;
}

.method, .ingridients, .tags {
  padding: 0 10px;
}
</style>
