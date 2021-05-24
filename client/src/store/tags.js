import {derived, writable, readable} from 'svelte/store'

// // All tags in backend. Fetched once, loading page.
// export const tags = readable([], async set => {
//   try {
//   const res = await fetch('/api/tags')
//   const tags = await res.json()
//   set(tags)
//   } catch (err) {
//     console.error(err)
//     set([])
//   }
//   // return () => {}
// })

// List of selected tags. Can be changed from user at any time.
function createSelectedTags() {
  const {subscribe, update} = writable([])
  return {
    subscribe,
    append: tag => update(tags => [...tags, tag]),
    remove: tag => update(tags => tags.filter(t => t !== tag))
  }
}

export const selectedTags = createSelectedTags()

// // Available tags to choose from. Filters already selected ones.
// // This list is shown in the autocomplete search bar.
// export const availableTags = derived(
//   [tags, selectedTags],
//   [$tags, $selectedTags] => $tags.filter(tag => !$selectedTags.includes(tag))
// )

