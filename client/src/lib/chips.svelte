<script>
	import Chip from './chip.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let chips = [];
	export let closable = false;

	function handleClose(e) {
		chips = chips.filter((it) => it !== e.detail);
		dispatch('close', e);
	}
</script>

<div class="chips">
	{#each chips as chip}
		<Chip {chip} {closable} on:close={handleClose} />
	{/each}
</div>

<style>
	.chips {
		--chips-display: flex;
		--chips-gap: 0.5rem;

		display: var(--chips-display);
		gap: var(--chips-gap);
	}
</style>
