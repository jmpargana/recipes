<template>
  <nav 
    class="sm:flex sm:justify-center"
  > 
    <div 
      class="block sm:hidden p-4"
      :class="open ? 'border-gray-100 border-b-2' : ''"
    >
      <button 
        @click="open = !open" 
        class="flex items-center px-3 py-2  text-teal-lighter border-teal-light hover:text-gray-800 hover:border-gray-600 focus:outline-none"
        :class="open ? 'border-gray-900' : ''"
      >
        <svg class="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path 
            v-show="!open"
            class="text-indigo-900"
            d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
          />
          <path 
            class="text-red-800"
            v-show="open"
            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
          />
	      </svg>
      </button>
    </div>
    <div 
      class="flex-col sm:inline-block" 
      :class="open ? 'block' : 'hidden'"
    >
      <router-link 
        v-for="(r, i) in routes" 
        :to="r.path" 
        :key="i"
        class="block sm:inline-block text-center p-1 m-4 hover:text-red-800 font-bold sm:border-white sm:border-b-2 sm:hover:text-green-500 sm:focus:text-green-600"
        active-class="text-red-900 sm:text-green-600"
      >{{ r.name }}</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const routes = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/about',
    name: 'About'
  },
  {
    path: '/create',
    name: 'Create'
  },
  {
    path: '/login',
    name: 'Login'
  },
]

const open = ref(false)
</script>
