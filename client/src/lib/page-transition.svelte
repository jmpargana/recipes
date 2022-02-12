<script>
	import { fly } from 'svelte/transition';
	export let refresh = '';
</script>

{#if refresh === '' || refresh === '/'}
	<slot />
{:else}
	{#key refresh}
		<div in:fly={{ x: -50, duration: 250 }}>
			<slot />
		</div>
	{/key}
{/if}
