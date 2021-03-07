<template>
  <div class="flex justify-center">
    {{ store.getters.matchingRecipes }}
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
</script>
