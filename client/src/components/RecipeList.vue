<template>
  <div class="flex justify-center">
    {{ store.getters.matchingRecipes }}
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
};
</script>
