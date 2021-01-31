<template>
  <div class="home">
    <input type="text" v-model="tag" @keyup.enter="appendTag" />
    <div class="recipes">
      <div v-for="recipe in recipes" :key="recipe._id">
        <div class="title">
          <h2>{{ recipe.title }} <span class="time">{{recipe.time}}</span></h2>
        </div>
        <ul v-for="tag in recipe.tags" :key="tag._id" class="horizontal-list">
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
      recipes: [],
      tags: [],
      tag: '',
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
        })
    },
    appendTag () {
      this.tags.push(this.tag)
      this.tag = ''
      this.generateRecipesByTags()
    },
    generateRecipesByTags () {
      this.recipes = this.rawRecipes.filter(recipe =>
        this.tags.every(tag => recipe.tags.includes(tag)))
    }
  }
}
</script>

<style>
.time {
  font-size: small;
}

ul.horizontal-list {
  list-style: none;
  display: inline;
  padding: 5px;
}

ul.horizontal-list li {
  display: inline;
  border: solid 1px black;
  border-radius: 50px;
  padding: 5px;
}
</style>
