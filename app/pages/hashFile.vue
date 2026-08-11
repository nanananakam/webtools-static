<template>
  <div>
    <h1>ファイルハッシュ確認ツール</h1>
    <div>
      入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。
    </div>
    <br />
    <v-file-input
      v-model="inputFile"
      label="ファイルを選択してください"
      show-size
    />
    <v-radio-group v-model="hashAlgo" inline>
      <v-radio label="MD5" value="MD5" />
      <v-radio label="SHA1" value="SHA1" />
      <v-radio label="SHA256" value="SHA256" />
      <v-radio label="SHA512" value="SHA512" />
    </v-radio-group>
    <v-radio-group v-model="hashFormat" inline>
      <v-radio label="HEX形式" value="HEX" />
      <v-radio label="Base64形式" value="Base64" />
    </v-radio-group>
    <v-btn @click="exec">ハッシュ生成</v-btn>
    <v-btn v-if="inputFile != null" @click="clear">クリア</v-btn>
    <br />
    <v-data-table
      :headers="commonDataTableHeaders"
      :items="resultDataTableItems"
      :loading="loading"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #[`item.value`]="{ item }">
        <ValueToClipboard :text="item.value" />
      </template>
    </v-data-table>
    <br />
    <h2>解説</h2>
    <h3>MD5</h3>
    <div>
      MD5は、ダイジェスト長が128bitの暗号学的ハッシュ関数のひとつです。歴史的に広く用いられていましたが、現在では強度は十分でないとされています。
    </div>
    <h3>SHA1</h3>
    <div>
      SHA1は、ダイジェスト長が160bitの暗号学的ハッシュ関数のひとつです。現在ではSHA1についても強度が十分でないとされ、電子証明書においてはSHA256以上の強度が必要とされています。
    </div>
    <h3>SHA256</h3>
    <div>
      SHA256は、SHA1の後継である暗号学的ハッシュ関数の一つであるSHA2のうち、ダイジェスト長が256bitのものです。
    </div>
    <h3>SHA512</h3>
    <div>
      SHA512は、SHA1の後継である暗号学的ハッシュ関数の一つであるSHA2のうち、ダイジェスト長が512bitのものです。
    </div>
    <h3>HEX形式</h3>
    <div>
      HEX形式は、バイナリデータを0から9の数字とaからfまでの文字の16種類を用いて16進数で表現する形式です。
    </div>
    <h3>Base64形式</h3>
    <div>
      Base64形式は、バイナリデータを印字可能な64種類の英数字記号を用いて表現する形式です。HEX形式よりも短い文字数で表現できます。
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { CommonDataTableHeaders, CommonDataTableItem } from '~/types/table'

type HashAlgo = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512'
type HashFormat = 'HEX' | 'Base64'

const description =
  '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。'

useSeoMeta({
  title: 'ファイルハッシュ確認ツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: 'ファイルハッシュ化ツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/hashFile/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/hashFile/' },
  ],
})

const inputFile = ref<File | null>(null)
const hashAlgo = ref<HashAlgo>('MD5')
const hashFormat = ref<HashFormat>('HEX')
const loading = ref(false)
const resultDataTableItems = ref<CommonDataTableItem[]>([])

const commonDataTableHeaders: CommonDataTableHeaders = [
  { title: 'ハッシュ化方法', key: 'key', sortable: false },
  { title: '結果', key: 'value', sortable: false },
]

function setNull() {
  resultDataTableItems.value = []
  loading.value = false
}

function clear() {
  inputFile.value = null
  setNull()
}

function exec() {
  const file = inputFile.value
  if (file == null) {
    setNull()
    return
  }
  resultDataTableItems.value = []
  loading.value = true
  const reader = new FileReader()
  reader.onloadend = (event) => {
    const arrayBuffer = event.target?.result
    if (arrayBuffer == null || typeof arrayBuffer === 'string') {
      console.error('unexpected error')
      setNull()
      return
    }
    const inputWordArray = CryptoJS.lib.WordArray.create(
      arrayBuffer as unknown as number[],
    )
    let hashedWordArray = CryptoJS.lib.WordArray.create()
    switch (hashAlgo.value) {
      case 'MD5':
        hashedWordArray = CryptoJS.MD5(inputWordArray)
        break
      case 'SHA1':
        hashedWordArray = CryptoJS.SHA1(inputWordArray)
        break
      case 'SHA256':
        hashedWordArray = CryptoJS.SHA256(inputWordArray)
        break
      case 'SHA512':
        hashedWordArray = CryptoJS.SHA512(inputWordArray)
        break
    }
    let hashedString = ''
    switch (hashFormat.value) {
      case 'HEX':
        hashedString = hashedWordArray.toString(CryptoJS.enc.Hex)
        break
      case 'Base64':
        hashedString = hashedWordArray.toString(CryptoJS.enc.Base64)
        break
    }
    resultDataTableItems.value = [
      {
        key: hashAlgo.value + '(' + hashFormat.value + '形式)',
        value: hashedString,
      },
    ]
    loading.value = false
  }
  reader.readAsArrayBuffer(file)
}
</script>
