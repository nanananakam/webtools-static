<template>
  <div>
    <h1>nanananakam webtools</h1>
    <div>Web開発・運用であるとうれしいちょっとしたツール集です。</div>
  </div>
</template>

<script setup lang="ts">
const description = 'Web開発・運用であるとうれしいちょっとしたツール集です。'

useSeoMeta({
  title: 'top',
  description,
  ogSiteName: 'nanananakam webtools',
  ogType: 'website',
  ogTitle: 'nanananakam webtools',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/',
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://webtools.nanananakam.com/' }],
})
</script>
