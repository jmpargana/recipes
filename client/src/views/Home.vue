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
      class="search-bar"
    ></v-autocomplete>
    <RecipeList :recipes="recipes" :colors="colors" />
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
      rawRecipes: [],
      colors: {}
    }
  },
  created () {
    this.fetchRecipes()
  },
  methods: {
    fetchRecipes () {
      axios.get('/recipes').then((resp) => {
        this.rawRecipes = resp.data
        this.availableTags = [
          ...new Set(
            this.rawRecipes.reduce((prev, curr) => prev.concat(curr.tags), [])
          )
        ]
        this.availableTags.forEach(tag => {
          this.colors[tag] = this.randomColor()
        })
      })
    },
    appendTag (tags) {
      this.tags = tags
      this.generateRecipesByTags()
    },
    generateRecipesByTags () {
      this.recipes = this.rawRecipes.filter((recipe) =>
        this.tags.every((tag) => recipe.tags.includes(tag))
      )
    },
    reset () {
      this.$refs.el.lazySearch = ''
      this.$refs.el.blur()
    },
    randomColor () {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }
  }
}
</script>
