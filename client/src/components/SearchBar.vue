<template>
  <div 
    class="border rounded-2xl mt-8 px-4 py-3 shadow-md my-2"
  >
    <div class="flex">
      <div class="w-5 h-5">
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z">
          </path>
        </svg>
      </div>
      <input 
        type="text" 
        v-model="tag"
        placeholder="Search me!"
        @focus="open = true"
        @keyup.enter="addTag"
        @keydown.tab="addTag"
        @keyup.down="handleNav(1)"
        @keyup.up="handleNav(-1)"
        class="focus:outline-none px-3"
      />
    </div>
    <ul 
      v-show="open && filteredSuggestions?.length > 0"
      class="pt-2"
    >
      <li 
        :class="i === highlighted ? 'bg-indigo-100' : ''"
        @mouseover="highlighted = i"
        v-for="(s, i) in filteredSuggestions" 
        @click="addTag(s)"
        :key="i"
        class="py-2 px-2"
      >{{ s }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const open = ref(true)
const highlighted = ref(0)
const tag = ref('')

// FIXME: Refactor to state var
const tags = ref([])

// FIXME: Deal with repetitions
const filteredSuggestions = computed(() => 
  suggestions.filter(s => 
    tag.value !== '' && 
    s.includes(tag.value) &&
    tags.value.every(t => t !== s)
  )
)

// TODO: Refactor after writing functions
const addTag = (s) => {
  if (suggestions.includes(s) &&
    !tags.value.includes(s)
  ) {
    tags.value.push(s)
    tag.value = ''
    highlighted.value = 0
  }
  if (filteredSuggestions.value.length > 0 &&
    filteredSuggestions.value.length > highlighted.value
  ) {
    tags.value.push(filteredSuggestions.value[highlighted.value])
    tag.value = ''
    highlighted.value = 0
  }
}

const handleNav = (num) => {
  highlighted.value += num
}

// FIXME: this will be a state var loaded with an axios request
const suggestions = [
  'soup',
  'asian',
  'cheese',
  'pasta',
  'italian',
  'indian'
]
</script>
