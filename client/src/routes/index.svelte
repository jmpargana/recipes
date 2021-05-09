<script>
	import Search from '$lib/Search.svelte';
	import Draw from '$lib/Draw.svelte';
</script>

<div class="wrapper">
	<div class="icon"><Draw /></div>
	<div class="search-block">
		<h1>Share Your Recipes</h1>
		<Search />
	</div>
</div>

<style>
	.wrapper {
		overflow-x: hidden;
	}

	.icon {
		position: fixed;
		top: 0;
		right: 0;
		transform: translateX(45%);
	}

	.search-block {
		margin: 1rem;
		z-index: 2;
		position: relative;
	}

	h1 {
		font-size: 3.4rem;
	}

	@media only screen and (min-width: 600px) {
		.wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			place-items: center;
			height: 80vh;
		}

		.search-block {
			grid-column: 1;
		}

		h1 {
			font-size: 6rem;
			width: 500px;
			line-height: 7rem;
		}

		.icon {
			grid-column: 2;
			left: 20rem;
			transform: translateX(0%);
		}
	}
</style>
