<template>
  <div>
    <span v-if="showText">{{ text }}</span>
    <v-btn v-if="copied" icon disabled variant="text">
      <v-icon size="small" :icon="mdiCheck" />
    </v-btn>
    <v-btn v-else icon variant="text" @click="copyText">
      <v-icon size="small" :icon="mdiContentCopy" />
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiCheck, mdiContentCopy } from '@mdi/js'

const props = withDefaults(
  defineProps<{
    text: string
    showText?: boolean
  }>(),
  {
    showText: true,
  },
)

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

function copyText() {
  if (!navigator.clipboard) {
    return
  }
  navigator.clipboard
    .writeText(props.text)
    .then(() => {
      copied.value = true
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch(() => {
      // クリップボードへの書き込みが拒否された場合は状態を変えない
    })
}

onBeforeUnmount(() => {
  clearTimeout(resetTimer)
})
</script>
