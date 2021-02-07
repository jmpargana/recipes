<template>
  <v-card class="mx-auto list" v-if="recipes.length > 0">
    <v-list three-lines>
      <div v-for="(recipe, index) in recipes" :key="index">
        <v-list-item :key="index" class="recipe">
          <v-list-item-content>
            <v-list-item-title
              class="title"
              ><h2>
                {{ recipe.title }}
              </h2></v-list-item-title
            >
            <v-list-item-subtitle>
              <v-chip
                v-for="tag in recipe.tags"
                :key="tag"
                class="ma-1"
                :color="colors[tag]"
                >{{ tag }}</v-chip
              >
            </v-list-item-subtitle>
            <v-list-item-action class="time text--lighten">
              {{ recipe.time }}
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="divider" v-if="index < recipes.length - 1"></v-divider>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ['recipes', 'colors']
}
</script>

<style scoped>
.list {
  max-width: 800px;
}

.recipe {
  text-align: left;
  padding-left: 50px;
  padding-top: 10px;
}

.title {
  padding-left: 10px;
  padding-bottom: 5px;
}

.time {
  position: absolute;
  top: 15px;
  right: 30px;
  color: #aa00c7;
}

.divider {
  margin: 0px 60px;
}

.chip {
  color: white;
}
</style>
