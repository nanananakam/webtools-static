<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>{{ message }}</h1>
        <NuxtLink to="/">Home page</NuxtLink>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const pageNotFound = '404 Not Found'
const otherError = 'An error occurred'

const message = computed(() =>
  props.error?.statusCode === 404 ? pageNotFound : otherError,
)

useHead({
  title: message,
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
