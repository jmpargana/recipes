import { writable } from 'svelte/store'

function createErrors() {
  const { subscribe, update } = writable({
    tags: '',
    title: '',
    time: '',
    method: '',
    ingridients: ''
  })
  return {
    subscribe,
    title: e => update(errs => ({...errs, title: e})),
    tags: e => update(errs => ({...errs, tags: e})),
    method: e => update(errs => ({...errs, method: e})),
    time: e => update(errs => ({...errs, time: e})),
    ingridients: e => update(errs => ({...errs, ingridients: e})),
  }
}

export const errors = createErrors()