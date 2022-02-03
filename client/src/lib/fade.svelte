<script>
	import IntersectionObserver from './intersection-observer.svelte';

	let node;

	export let fromLeft = false;
	const distance = fromLeft ? '-50px' : '50px';
</script>

<IntersectionObserver element={node} let:intersecting rootMargin="50px">
	<div bind:this={node}>
		{#if intersecting}
			<div class="fade-in" style="--fade-from: {distance}">
				<slot />
			</div>
		{/if}
	</div>
</IntersectionObserver>

<style>
	.fade-in {
		animation: 500ms linear fromLeft;
		opacity: 1;
	}

	@keyframes fromLeft {
		from {
			transform: translateX(var(--fade-from));
			opacity: 0;
		}
	}
</style>
