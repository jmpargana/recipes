import { writable } from 'svelte/store';

function createTags() {
	const { subscribe, update, set } = writable([]);

	return {
		subscribe,
		push: (tag) => update((tags) => [...tags, tag].filter(Boolean)),
		remove: (tag) => update((tags) => tags.filter((it) => it !== tag)),
		reset: () => set([])
	};
}

export const newTags = createTags();

export const tags = writable([]);

// TODO: should be derived
function createSelectedTags() {
	const { subscribe, update, set } = writable([]);
	return {
		subscribe,
		push: (tag) => update((tags) => [...tags, tag]),
		remove: (tag) => update((tags) => tags.filter((it) => it.id !== tag.id)),
		set,
		update
	};
}

export const selectedTags = createSelectedTags();
