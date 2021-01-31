<template>
  <div class="home">
    <input />
    <div class="recipes">
      <div v-for="recipe in recipes" :key="recipe._id">
        <h2>{{ recipe.title }}</h2>
        <p>{{ recipe.time }}</p>
        <ul v-for="tag in recipe.tags" :key="tag._id">
          <li>{{ tag }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
      recipes: []
    }
  },
  created () {
    this.fetchRecipes()
  },
  methods: {
    fetchRecipes () {
      axios.get('/recipes')
        .then(resp => {
          this.recipes = resp.data
        })
    }
  }
}
</script>
