<script>
	import AutoComplete from 'simple-svelte-autocomplete';

	import { tags, selectedTags } from '../stores/tags';
	import Chips from '../lib/chips.svelte';

	fetch('http://localhost:3001/tags')
		.then((res) => res.json())
		.then((data) => ($tags = data));

	function handleUnselectTag(e) {
		const tag = $tags.find((it) => it.name === e.detail.detail);
		selectedTags.remove(tag);
	}

	let ref

	$: if (ref) {
		ref.querySelectorAll('span.autocomplete-clear-button')[0].textContent = ''
	}

	// $: console.log(ref.getElementsByClassName('autocomplete-clear-button'))
</script>

<div class="search-block-wrapper">
	<div class="wrapper" bind:this={ref}>
		<AutoComplete items={$tags} labelFieldName="name" multiple bind:selectedItem={$selectedTags} />
	</div>
	<Chips chips={$selectedTags.map((it) => it.name)} on:close={handleUnselectTag} closable />
</div>

<style>
.search-block-wrapper {
	display: flex;
	flex-direction: column;
	gap: var(--space-xs);
}

.wrapper {
	display: flex;
	justify-content: center;
}

:global(.tags) {
	display: none !important;
}	

:global(.autocomplete) {
	height: auto !important;
}

:global(.input-container) {
	height: 64px !important;
	width: 95vw !important;
	/* max-width: 600px !important; */
	border-radius: 32px !important;
	padding-left: 2rem !important;
}

@media (min-width: 600px) {
	:global(.input-container) {
		width: 80vw !important;
	}
}

@media (min-width: 900px) {
	:global(.input-container) {
		width: 60vw !important;
	}
}

@media (min-width: 1200px) {
	:global(.input-container) {
		width: 50vw !important;
	}
}


@media (min-width: 1500px) {
	:global(.input-container) {
		width: 40vw !important;
	}
}


:global(.autocomplete-clear-button) {
	position: relative !important;
	display: flex !important;
	flex-direction: column !important;
	justify-content: center !important;
	background-image: url('../assets/icons/close-transparent.svg') !important;
	background-position: center  !important;
	background-repeat: no-repeat !important;
	margin-right: 1rem !important;
}

:global(.autocomplete-list) {
	position: absolute !important;
	top: 64px !important;
	scrollbar-color: white !important;
	scrollbar-width: thin !important;
	border: 1px solid var(--color-bg-secondary) !important;

	/* border-top: none !important; */
	box-shadow: 0 3px 10px rgb(0 0 0 / 0.2) !important;
}

:global(.autocomplete-list::-webkit-scrollbar) {
	background: white !important;
	width: 12px !important;
}

:global(.autocomplete-list::-webkit-scrollbar-thumb) {
	background: var(--color-tertiary) !important;
	border-radius: 24px !important;
}

:global(.autocomplete-list-item.confirmed) {
	background-color: var(--color-primary) !important;
}
:global(.autocomplete-list-item.selected) {
	background-color: var(--color-primary) !important;
}
:global(.autocomplete-list-item) {
	padding: var(--space-sm) var(--space-lg) !important;
}

:global(.autocomplete-list-item:hover) {
	background-color: var(--color-tertiary) !important;
}

:global(.autocomplete.show-clear::after) {
	display: none !important;
}
</style>