<template>
  <div class="w-screen justify-center flex">
    <div class="w-10/12 sm:w-4/12 py-2 my-4">
      <SearchBar />
      <SearchOptions />
      <Tags />
    </div>
  </div>
</template>

<script>
import SearchBar from "./SearchBar.vue";
import SearchOptions from "./SearchOptions.vue";
import Tags from "./Tags.vue";

export default {
  components: { SearchBar, SearchOptions, Tags },
};
</script>
