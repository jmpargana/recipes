<template>
  <div class="flex flex-wrap">
    <div 
      v-for="(tag, i) in tags"
      :key="i"
      class="flex items-center mx-1 px-3 py-1 rounded border border-red-600 rounded-3xl text-gray-200 shadow-sm bg-red-600 mb-1"
    >
      <div>{{ tag }}</div>
      <div class="ml-1 w-3 h-3" @click="handleDelete(i)">
        <svg class="fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
          />
	</svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// FIXME: Add colors

// FIXME: load from global state
const tags = ref([
  'pizza',
  'italian',
  'cheese',
  'tomato sauce'
])

const handleDelete = i => {
  tags.value.splice(i, 1)
}
</script>
