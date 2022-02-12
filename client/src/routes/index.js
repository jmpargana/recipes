import Home from "./index.svelte";
import About from "./about.svelte";
import NewRecipe from "./new-recipe.svelte";
import Recipe from "./recipe.svelte";

const routes = {
  "/": Home,
  "/about": About,
  "/new-recipe": NewRecipe,
  "/recipe": Recipe,
};

export default routes;
