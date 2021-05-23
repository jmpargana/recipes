import {derived, writable} from 'svelte/store'
import {selectedTags} from './tags'

// Complete recipes loaded from backend.
// Depends on the selectedTags and will trigger a call
// everytime a tag is added or removed.
export const recipes = derived(
  selectedTags,
  async $selectedTags => {
    const res = await fetch('/api?tags=' + $selectedTags.join(','))
    const recipes = await res.json()
    return recipes
  }
)

// Single recipe. Used to preserve state while editing, before submition.
function createRecipe() {
  const {subscribe, update, set} = writable({})
  return {
    subscribe,
    reset: () => set({}),
    changeTitle: title => update(r => ({...r, title})),
    changeTime: time => update(r => ({...r, time})),
    changeMethod: method => update(r => ({...r, method})),
    changeIngridient: ingridient => update(r => ({...r, ingridients: [r.ingridients, ingridient]})),
    changeTag: tag => update(r => ({...r, tags: [...r.tags, tag]}))
  }
}

export const recipe = createRecipe()
