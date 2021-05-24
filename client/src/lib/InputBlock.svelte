<script>
	export let label;
	export let textArea = false;
	export let customEvent = null;
	export let span = 1;
	export let value;
	export let err = '';
</script>

<div style="grid-column: span {span}">
	<label for="block">{label} </label>
	{#if textArea}
		<textarea bind:value />
	{:else}
		<input on:keyup={customEvent} id="block" type="text" bind:value />
	{/if}
	{#if err}
		<span>{err}</span>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
	}
	span {
		color: red;
		font-size: 0.8rem;
	}
</style>
