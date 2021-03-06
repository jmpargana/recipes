import { createStore } from 'vuex'

const state = {
  count: 0,
  tags: ['pizza', 'italian'],
}

const mutations = {
  increment (state) {
    state.count++
  },
  decrement (state) {
    state.count--
  },
  addTag (state, payload) {
   state.tags.push(payload.tag)
  },
  deleteTag (state, payload) {
    state.tags.splice(payload.index, 1)
  }
}

const actions = {
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd ({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  }
}

const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

export const store = createStore({
  state,
  getters,
  actions,
  mutations
})
