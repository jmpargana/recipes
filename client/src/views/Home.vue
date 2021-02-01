<template>
  <v-container>
    <v-autocomplete
      ref="el"
      auto-select-first
      rounded
      multiple
      chips
      deletable-chips
      solo
      clearable
      :items="availableTags"
      @input="appendTag"
      @change="reset"
    ></v-autocomplete>
    <RecipeList :recipes="recipes" />
  </v-container>
</template>

<script>
import axios from 'axios'
import RecipeList from '../components/RecipeList'

export default {
  name: 'Home',
  components: {
    RecipeList
  },
  data () {
    return {
      recipes: [],
      tags: [],
      availableTags: [],
      rawRecipes: []
    }
  },
  created () {
    this.fetchRecipes()
  },
  methods: {
    fetchRecipes () {
      axios.get('/recipes')
        .then(resp => {
          this.rawRecipes = resp.data
          this.availableTags = [...new Set(
            this.rawRecipes.reduce((prev, curr) => prev.concat(curr.tags), []))]
        })
    },
    appendTag (tags) {
      this.tags = tags
      this.generateRecipesByTags()
    },
    generateRecipesByTags () {
      this.recipes = this.rawRecipes.filter(recipe =>
        this.tags.every(tag => recipe.tags.includes(tag)))
    },
    reset () {
      this.$refs.el.lazySearch = ''
    }
  }
}
</script>
