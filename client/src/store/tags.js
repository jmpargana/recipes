import {writable, readable} from 'svelte/store'

export const tags = readable([], async set => {
  const res = await fetch('/api/tags')
  const tags = await res.json()
  set(tags)
  return () => {}
})

function createSelectedTags() {
  const {subscribe, update} = writable([])
  return {
    subscribe,
    append: tag => update(tags => [...tags, tag]),
    remove: tag => update(tags => tags.filter(t => t !== tag))
  }
}

export const selectedTags = createSelectedTags
