import { derived, writable } from 'svelte/store';

// All tags in backend. Fetched once, loading page.
function createTags() {
	const { subscribe, set } = writable([]);
	return {
		subscribe,
		load: async () => {
			try {
				const res = await fetch('/api/tags');
				const tags = await res.json();
				set(tags);
				console.log('Tags were set');
			} catch (err) {
				console.error(err);
			}
		}
	};
}

export const tags = createTags();
// Call once on start
// FIXME: extract call to component?
// tags.load()

// List of selected tags. Can be changed from user at any time.
function createSelectedTags() {
	const { subscribe, update } = writable([]);
	return {
		subscribe,
		append: (tag) => update((tags) => [...tags, tag]),
		remove: (tag) => update((tags) => tags.filter((t) => t !== tag))
	};
}

export const selectedTags = createSelectedTags();

// Available tags to choose from. Filters already selected ones.
// This list is shown in the autocomplete search bar.
export const availableTags = derived([tags, selectedTags], ([$tags, $selectedTags]) =>
	$tags.filter((tag) => !$selectedTags.includes(tag))
);

export const tag = writable('');

export const matchingTags = derived([tag, availableTags], ([$tag, $availableTags]) =>
	$tag == '' ? $availableTags : $availableTags.filter((t) => t.includes($tag))
);
