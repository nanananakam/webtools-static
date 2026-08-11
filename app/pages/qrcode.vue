<template>
  <div>
    <h1>QRコード生成ツール</h1>
    <div>
      入力された文字列からQRコードを作成します。ダウンロードもできます。誤り訂正レベルを選択できます。
    </div>
    <br />
    <v-text-field v-model="inputString" @change="createQr" />
    <v-radio-group v-model="errorCorrectionLevel" label="誤り訂正レベル" inline>
      <v-radio label="L(~7%)" value="L" />
      <v-radio label="M(~15%)" value="M" />
      <v-radio label="Q(~25%)" value="Q" />
      <v-radio label="H(=35%)" value="H" />
    </v-radio-group>
    <v-btn type="submit" @click="createQr">生成</v-btn>
    <br />
    <img
      v-if="resultDataUrl"
      :src="resultDataUrl"
      :alt="'QRコード: ' + inputString"
    />
    <br />
    <a v-if="resultDataUrl" :href="resultDataUrl" download>ダウンロード</a>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const description =
  '入力された文字列からQRコードを作成します。ダウンロードもできます。誤り訂正レベルを選択できます。'

useSeoMeta({
  title: 'QRコード生成ツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: 'QRコード作成ツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/qrcode/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/qrcode/' },
  ],
})

const inputString = ref('')
const resultDataUrl = ref<string | null>(null)
const errorCorrectionLevel = ref<QRCode.QRCodeErrorCorrectionLevel>('M')

async function createQr() {
  if (!inputString.value) {
    resultDataUrl.value = null
    return
  }
  try {
    resultDataUrl.value = await QRCode.toDataURL(inputString.value, {
      errorCorrectionLevel: errorCorrectionLevel.value,
    })
  } catch (error) {
    console.error(error)
    resultDataUrl.value = null
  }
}
</script>
