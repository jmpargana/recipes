<script>
  import Hamburger from '../lib/Hamburger.svelte'

  let outerWidth
  const BREAKPOINT = 600
</script>

<svelte:window bind:outerWidth />

<nav class="flex-center">
  {#if outerWidth < BREAKPOINT}
    <Hamburger  />
  {:else}
    <div class="flex">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/upload">Upload</a>
      <a href="/list">List</a>
    </div>
    <button>Sign in</button>
  {/if}
</nav>


<style lang="scss">
  /* Load variables from scss var file */
  $sm: 600px;
  $md: 960px;
  $lg: 1280px;
  $xl: 1920px;

  nav {
    --padding: var(--space-lg);
    width: calc(100vw - 2 * var(--padding));
    margin: var(--padding);

    a {
      font-size: var(--text-md);
    }

    @media (min-width: $md) {
      --padding: var(--space-xl);
      margin: calc(var(--padding) / 1.5) var(--padding)
    }
  }

	a {
		padding-right: var(--space-md);
	}
</style>
