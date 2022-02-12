<script>
  import Router, { location } from "svelte-spa-router";
  import routes from "./routes";
  import Nav from "./lib/nav.svelte";
  import PageTransition from "./lib/page-transition.svelte";
</script>

<main>
  <Nav />
  <PageTransition refresh={$location}>
    <div class="container-outer">
      <div class="container-inner">
        <Router {routes} />
      </div>
    </div>
  </PageTransition>
</main>

<style>
  .container-outer {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
    padding-top: var(--space-lg);
  }

  .container-inner {
    max-width: 800px;
    width: 100%;
  }
</style>
