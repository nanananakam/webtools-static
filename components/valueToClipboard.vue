<template>
  <div>
    <span v-if="showText">{{ text }}</span>
    <v-btn v-if="copied" icon disabled><v-icon small>{{ mdiCheck }}</v-icon></v-btn>
    <v-btn v-else v-on:click="copyText" icon><v-icon small>{{ mdiContentCopy }}</v-icon></v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mdiCheck, mdiContentCopy} from "@mdi/js";

interface ComponentData {
  copied: boolean,
  mdiCheck: string,
  mdiContentCopy: string,
}

export default Vue.extend({
  name: "valueToClipboard",
  data(): ComponentData {
    return {
      copied: false,
      mdiCheck: mdiCheck,
      mdiContentCopy: mdiContentCopy,
    }
  },
  props: {
    text: {
      type: String
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    copyText: function () {
      if (!navigator.clipboard) {
        return;
      }
      const self = this;
      navigator.clipboard.writeText(this.text).then(function () {
        self.copied = true;
        setTimeout(function () {
          self.copied = false;
        }, 2000);
      }).catch(function () {
        // クリップボードへの書き込みが拒否された場合は状態を変えない
      });
    }
  }
})
</script>

<style scoped>

</style>
