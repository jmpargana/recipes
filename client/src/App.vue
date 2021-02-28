<template>
  <Navbar />
  <div class="h-screen flex justify-center">
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>


