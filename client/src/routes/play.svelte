<script>
	let clicked = false;
</script>

<div class="wrapper" class:clicked on:click={() => (clicked = true)}>
	<input type="text" placeholder="Search" />
</div>

<style>
	.wrapper {
		height: 100vh;
		background: gray;
	}

	input {
		position: fixed;
		top: 30vh;
	}

	.clicked {
		animation: move 1s forwards;
	}

	@keyframes move {
		to {
			position: fixed;
			transform: translate(40vw, -10vh);
			background: white;
		}
	}
</style>
