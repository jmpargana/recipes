<nav>
	<div class="routes">
		<a href="/">Home</a>
		<a href="/about">About</a>
		<a href="/upload">Upload</a>
	</div>
	<button>Sign in</button>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		position: absolute;
		top: 0;
		width: calc(100vw - 4rem);
		margin: 2rem;
	}
	.routes {
		display: flex;
	}

	.routes a {
		padding-right: 1rem;
	}
</style>
