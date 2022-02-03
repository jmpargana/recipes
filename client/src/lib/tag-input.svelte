<script>
	import { newTags } from '../stores/tags';
	import Chips from '../lib/chips.svelte';

	function handleNewTag(e) {
		e.preventDefault();
		// TODO: validate repeating tags
		const newTag = document.getElementById('tags').value;
		newTags.push(newTag);
		document.getElementById('tags').value = '';
	}

	function handleEnter(e) {
		if (e.keyCode === 13) {
			handleNewTag(e);
		}
	}

	function cleanTag(e) {
		newTags.remove(e.detail.detail);
	}
</script>

<div class="tag-input-wrapper">
	<div class="tag-input">
		<label for="tags">Tags</label>
		<input id="tags" name="tags" type="text" on:keyup={handleEnter} />
		<button on:click={handleNewTag}>Add</button>
	</div>

	<Chips chips={$newTags} on:close={cleanTag} closable />
</div>
