<template>
  <div class="">
    <div class="m-10">Space</div>
    <div class="rounded-lg bg-gray-100">
      <div class="flex flex-col">
        <label for="title">Title</label>
        <input v-model="recipe.title" type="text" id="title" />
      </div>
      <div class="flex flex-col">
        <span>Ingridients</span>
        <div class="flex">
          <div class="flex flex-col">
            <label for="ingridient">Name</label>
            <input v-model="ingridient.name" type="text" id="ingridient" />
          </div>
          <div class="flex flex-col">
            <label for="amount">Amount</label>
            <input v-model="ingridient.amount" type="text" id="amount" />
          </div>
          <button
            class="bg-blue-600 rounded-3xl px-4 m-2 text-white"
            @click="handleIngridient"
          >
            Add
          </button>
        </div>
      </div>
      <div class="flex flex-col">
        <label for="tags">Tags</label>
        <input @keydown.enter="handleTag" v-model="tag" type="text" id="tags" />
      </div>
      <div class="flex">
        <div
          v-for="tag in recipe.tags"
          :key="tag"
          class="bg-red-500 rounded-xl mr-1 my-2 px-2 text-white"
          @click="handleDelete(tag)"
        >
          {{ tag }}
        </div>
      </div>
      <div class="flex flex-col">
        <label for="public">Public</label>
        <input
          v-model="recipe.public"
          class="rounded form-checkbox text-pink-600"
          type="checkbox"
          id="public"
        />
      </div>
      <div class="flex flex-col">
        <label for="method">Method</label>
        <textarea v-model="recipe.method" />
      </div>
    </div>
    <pre>{{ recipe }}</pre>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  setup() {
    const recipe = reactive({
      title: "",
      public: false,
      method: "",
      tags: [],
      ingridients: [],
    });
    const ingridient = reactive({
      name: "",
      amount: "",
    });
    const handleTag = () => {
      recipe.tags.push(tag.value);
      tag.value = "";
    };
    const handleDelete = (tag) => {
      recipe.tags = recipe.tags.filter((t) => t !== tag);
    };
    const handleIngridient = () => {
      recipe.ingridients.push(ingridient);
      ingridient.name = "";
      ingridient.amount = "";
    };
    const tag = ref("");
    return {
      recipe,
      tag,
      handleTag,
      handleDelete,
      ingridient,
      handleIngridient,
    };
  },
};
</script>
