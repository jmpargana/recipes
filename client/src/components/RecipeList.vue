<template>
  <v-card class="mx-auto">
    <v-list three-lines>
      <template v-for="(recipe, index) in recipes">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title
              ><h2>
                {{ recipe.title }}
              </h2></v-list-item-title
            >
            <v-list-item-subtitle>
              <v-chip
                v-for="tag in recipe.tags"
                :key="tag"
                class="ma-2"
                color="primary"
                >{{ tag }}</v-chip
              >
            </v-list-item-subtitle>
            <v-list-item-action>
              {{ recipe.time }}
            </v-list-item-action>
            <v-divider v-if="index < recipes.length - 1"></v-divider>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ['recipes']
}
</script>

<style>
h2.title {
  text-align: left;
}
</style>
