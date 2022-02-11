<script>
	import { createEventDispatcher } from 'svelte';
	import Icon from './icon.svelte';
	const dispatch = createEventDispatcher();

	export let chip = {};
	export let closable;


	function handleClick() {
		dispatch('close', chip);
	}
</script>

<div class="chip">
	<div class="chip-label">
		{chip}
	</div>
	{#if closable}
		<div class="chip-delete" on:click={handleClick}>
			<Icon icon="close-transparent" />
		</div>
	{/if}
</div>

<style>
	.chip {
		--chip-padding-horizontal: 12px;
		--chip-font-weight: normal;
		--chip-bg-color: rgba(0, 0, 0, 0.12);
		--chip-font-size: 14px;
		--chip-text-color: var(--color-text-primary);
		--chip-height: 32px;

		padding-left: var(--chip-padding-horizontal);
		padding-right: var(--chip-padding-horizontal);
		font-weight: var(--chip-font-weight);
		display: inline-flex;
		box-sizing: border-box;
		vertical-align: middle;
		align-items: center;
		margin: 2px 0;
		background-color: var(--chip-bg-color);
		font-size: var(--chip-font-size);
		color: var(--chip-text-color);
		height: var(--chip-height);
		line-height: var(--chip-height);
		border-radius: var(--chip-height);
		position: relative;
	}

	.chip-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
		flex-shrink: 1;
		min-width: 0;
		background-color: transparent;
	}

	.chip-delete {
		margin-left: 4px;
		margin-right: calc(-1 * var(--chip-padding-horizontal) + 4px);
		text-align: center;
		cursor: pointer;
		flex-shrink: 0;
		background-repeat: no-repeat;
		background-color: transparent;
		width: 24px;
		height: 24px;
		color: var(--color-text-primary);
		opacity: 0.54;
		position: relative;

		display: grid;
		place-items: center;
	}
</style>
