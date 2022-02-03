<script>
	import CloseTransparent from '../assets/icons/close-transparent.svelte';
	import CloseRound from '../assets/icons/close-round.svelte';

	const icons = {
		close: CloseRound,
		'close-transparent': CloseTransparent
	};

	export let icon;
</script>

<i class="icon-wrapper"><svelte:component this={icons[icon]} /></i>

<style>
	.icon-wrapper {
		display: grid;
		place-items: center;
	}
</style>
