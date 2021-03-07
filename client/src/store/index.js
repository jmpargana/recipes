import { createStore } from 'vuex'

const state = {
  recipes: [
    {
      title: "Marrocan Feast",
      tags: ['arab', 'falafel', 'hummus', 'couscus', 'delicious', 'eggplant']
    },
    {
      title: "Pumpkin Soup",
      tags: ['soup', 'portuguese', 'pumpkin', 'sweet']
    },
    {
      title: "Thai Nuddles",
      tags: ['thai', 'asian', 'nuddles', 'peanut butter', 'soy']
    },
    {
      title: "Baked Ziti",
      tags: ['pasta', 'italian', 'cheese', 'tomato sauce', 'meat']
    }
  ],
  tags: ['pizza', 'italian'],
}

const mutations = {
  addTag (state, payload) {
   state.tags.push(payload.tag)
  },
  deleteTag (state, payload) {
    // FIXME: move tag back to var
    state.tags.splice(payload.index, 1)
  }
}

const actions = {

}

const getters = {
  availableTags: state => [
    ...new Set(
      state.recipes.reduce((prev, curr) => prev.concat(curr.tags), []) 
    )
  ],
  matchingRecipes: state =>
    state.recipes.filter(recipe => state.tags.every(tag => recipe.tags.includes(tag)))
}

export const store = createStore({
  state,
  getters,
  actions,
  mutations
})
