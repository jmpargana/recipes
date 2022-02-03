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
</script>

<AutoComplete items={$tags} labelFieldName="name" multiple bind:selectedItem={$selectedTags} />

<Chips chips={$selectedTags.map((it) => it.name)} on:close={handleUnselectTag} closable />
