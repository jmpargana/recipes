<template>
  <Navbar />
  <div class="flex justify-center h-screen">
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: {Navbar}
}
</script>


