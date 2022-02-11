<script>
	import { newTags } from '../stores/tags';
	import Chips from '../lib/chips.svelte';
	import Input from '../lib/input.svelte'
	import Button from '../lib/button.svelte'

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
		<Input id="tags" name="tags" type="text" on:keyup={handleEnter} />
		<Button sm on:click={handleNewTag} label="Add"/>
	</div>
	<Chips chips={$newTags} on:close={cleanTag} closable />
</div>


<style>
	.tag-input-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tag-input {
		display: flex;
	}
</style>