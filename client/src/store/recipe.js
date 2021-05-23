import {derived, writable} from 'svelte/store'
import {selectedTags} from './tags'

export const recipes = derived(
  selectedTags,
  async $selectedTags => {
    const res = await fetch('/api?tags=' + $selectedTags.join(','))
    const recipes = await res.json()
    return recipes
  }
)

function createRecipe() {
  const {subscribe, update, set} = writable({})
  return {
    subscribe,
    reset: () => set({}),
    addTitle: title => update(r => ({...r, title})),
    addTime: time => update(r => ({...r, time})),
    addMethod: method => update(r => ({...r, method})),
    addIngridient: ingridient => update(r => ({...r, ingridients: [r.ingridients, ingridient]})),
    addTag: tag => update(r => ({...r, tags: [...r.tags, tag]}))
  }
}

export const recipe = createRecipe()
