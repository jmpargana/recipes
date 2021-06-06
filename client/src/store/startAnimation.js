import { writable } from 'svelte/store';

function createStartAnimation() {
	const { subscribe, set } = writable(false);
	return {
		subscribe,
		start: () => set(true)
	};
}

export const startAnimation = createStartAnimation();
