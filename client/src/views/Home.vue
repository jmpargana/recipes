<template>
  <div>
    <div class="py-10 sm:py-18"></div>
    <SearchBlock />
    <RecipeList />
  </div>
</template>

<script>
import SearchBlock from "../components/SearchBlock.vue";
import RecipeList from "../components/RecipeList.vue";

export default {
  components: { SearchBlock, RecipeList },
};
</script>
