<script>
	import SvelteMarkdown from 'svelte-markdown';

	let edit = true;
	let method;
</script>

<div class="container">
	<label for="method">Method</label>
	<div class="tabs">
		<div class="tab" on:click={() => (edit = true)}>Edit</div>
		<div class="tab" on:click={() => (edit = false)}>Preview</div>
	</div>

	{#if edit}
		<div id="edit" class="panel">
			<textarea bind:value={method} name="method" id="method" />
		</div>
	{:else}
		<div id="preview" class="panel">
			<SvelteMarkdown bind:source={method} />
		</div>
	{/if}
</div>

<style>
	textarea {
		border: none;
		overflow: auto;
		background-color: transparent;
		outline: none;
		box-shadow: none;
		resize: none;
		width: 100%;
		height: 100%;
	}

	.panel {
		height: 200px;
		border: 1px solid black;
	}

	.container {
		display: grid;
		grid-column: span 2;
	}

	.tabs {
		display: flex;
	}

	.tab {
		padding-right: 1rem;
	}
</style>
