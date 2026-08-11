<template>
  <div>
    <h1>Base64文字列エンコード・デコードツール</h1>
    <div>
      フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。
    </div>
    <br />
    <v-textarea v-model="inputString" variant="solo" />
    <v-btn @click="clearString">クリア</v-btn>
    <v-radio-group v-model="convertType" inline>
      <v-radio label="文字列->Base64" value="to_base_64" />
      <v-radio label="Base64->文字列" value="from_base_64" />
    </v-radio-group>
    <br />
    <v-textarea :model-value="result" disabled />
    <br />
    <h2>解説</h2>
    <div>
      Base64エンコードは、データを印字可能な64種類の英数字記号を用いて表現する形式で、BASIC認証や電子メールなど、ASCII外の文字やバイナリデータを扱うことに制約がある場面でそれらのデータを扱うために利用されます。
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'

type ConvertType = 'to_base_64' | 'from_base_64'

const description =
  'フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。'

useSeoMeta({
  title: 'Base64文字列エンコード・デコードツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: 'Base64エンコード・デコードツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/base64/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/base64/' },
  ],
})

const inputString = ref('')
const convertType = ref<ConvertType>('to_base_64')

const result = computed<string>(() => {
  if (convertType.value === 'to_base_64') {
    return CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(inputString.value),
    )
  }
  try {
    return CryptoJS.enc.Utf8.stringify(
      CryptoJS.enc.Base64.parse(inputString.value),
    )
  } catch {
    return '入力がBase64ではありません'
  }
})

function clearString() {
  inputString.value = ''
}
</script>
