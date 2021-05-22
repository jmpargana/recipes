<script>
	import Search from '$lib/Search.svelte';
	import Draw from '$lib/Draw.svelte';

	// Refactor to store
	let started;

	function handleClick() {
		started = true;
	}
</script>

<div class="wrapper">
	<div class="icon" class:hide={started}><Draw /></div>
	<div on:click={handleClick} class="search-block">
		<h1 class:down={started}>Share Your Recipes</h1>
		<div class:center={started}>
			<Search />
		</div>
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

	.hide {
		animation: hide 1s forwards;
	}

	.center {
		animation: center 1s forwards;
	}

	.down {
		animation: down 1s forwards;
	}

	@keyframes down {
		to {
			opacity: 0;
			transform: translate(0%, 100%);
			display: none;
		}
	}

	@keyframes center {
		to {
			/* FIXME: responsive percentages */
			transform: translate(90%, -10%) scale(1.2);
		}
	}

	@keyframes hide {
		to {
			opacity: 0;
			transform: translate(-100%, 30%);
			display: none;
		}
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
