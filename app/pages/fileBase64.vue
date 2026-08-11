<template>
  <div>
    <h1>ファイルBase64エンコードツール</h1>
    <div>入力されたファイルをBase64に変換します。</div>
    <br />
    <v-file-input
      v-model="inputFile"
      label="ファイルを選択してください"
      show-size
    />
    <v-btn @click="exec">Base64変換</v-btn>
    <v-btn v-if="inputFile != null" @click="clear">クリア</v-btn>
    <v-textarea :model-value="result" disabled :loading="loading" />
    <div v-if="result">
      クリップボードへコピーはこちら→<ValueToClipboard
        :text="result"
        :show-text="false"
        style="display: inline"
      />
    </div>
    <h2>解説</h2>
    <div>
      Base64エンコードは、データを印字可能な64種類の英数字記号を用いて表現する形式で、BASIC認証や電子メールなど、ASCII外の文字やバイナリデータを扱うことに制約がある場面でそれらのデータを扱うために利用されます。
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'

const description = '入力されたファイルをBase64に変換します。'

useSeoMeta({
  title: 'ファイルBase64エンコードツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: 'Base64エンコード・デコードツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/fileBase64/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/fileBase64/' },
  ],
})

const inputFile = ref<File | null>(null)
const result = ref('')
const loading = ref(false)

function clear() {
  inputFile.value = null
  result.value = ''
  loading.value = false
}

function exec() {
  const file = inputFile.value
  if (file == null) {
    result.value = ''
    loading.value = false
    return
  }
  loading.value = true
  const reader = new FileReader()
  reader.onloadend = (event) => {
    const arrayBuffer = event.target?.result
    if (arrayBuffer == null || typeof arrayBuffer === 'string') {
      console.error('unexpected error')
      result.value = ''
      loading.value = false
      return
    }
    // TODO: out of memoryの時にエラー表示できるようにする
    const inputWordArray = CryptoJS.lib.WordArray.create(
      arrayBuffer as unknown as number[],
    )
    result.value = CryptoJS.enc.Base64.stringify(inputWordArray)
    loading.value = false
  }
  reader.readAsArrayBuffer(file)
}
</script>
