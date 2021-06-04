import {derived} from 'svelte/store'
import {selectedTags} from './tags'

// Complete recipes loaded from backend.
// Depends on the selectedTags and will trigger a call
// everytime a tag is added or removed.
export const recipes = derived(
  selectedTags,
  async $selectedTags => {
    try {
      const res = await fetch('http://localhost:3000/api?tags=' + $selectedTags.join(','))
      const recipes = await res.json()
      return recipes || []
    } catch (err) {
      console.error('Failed fetching recipes from server with: ', err)
      return []
    }
  }
)