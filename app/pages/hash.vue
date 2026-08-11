<template>
  <div>
    <h1>文字列ハッシュ化ツール</h1>
    <div>
      入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。
    </div>
    <br />
    <v-text-field v-model="inputString" />
    <v-btn @click="clearString">クリア</v-btn>
    <br />
    <v-data-table
      :headers="commonDataTableHeaders"
      :items="resultDataTableItems"
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

const description =
  '入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。'

useSeoMeta({
  title: '文字列ハッシュ化ツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: '文字列ハッシュ化ツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/hash/',
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://webtools.nanananakam.com/hash/' }],
})

const inputString = ref('')

const commonDataTableHeaders: CommonDataTableHeaders = [
  { title: 'ハッシュ化方法', key: 'key', sortable: false },
  { title: '結果', key: 'value', sortable: false },
]

const resultDataTableItems = computed<CommonDataTableItem[]>(() => {
  const input = inputString.value
  return [
    {
      key: 'MD5(HEX形式)',
      value: CryptoJS.MD5(input).toString(CryptoJS.enc.Hex),
    },
    {
      key: 'MD5(Base64形式)',
      value: CryptoJS.MD5(input).toString(CryptoJS.enc.Base64),
    },
    {
      key: 'SHA1(HEX形式)',
      value: CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex),
    },
    {
      key: 'SHA1(Base64形式)',
      value: CryptoJS.SHA1(input).toString(CryptoJS.enc.Base64),
    },
    {
      key: 'SHA256(HEX形式)',
      value: CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex),
    },
    {
      key: 'SHA256(Base64形式)',
      value: CryptoJS.SHA256(input).toString(CryptoJS.enc.Base64),
    },
    {
      key: 'SHA512(HEX形式)',
      value: CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex),
    },
    {
      key: 'SHA512(Base64形式)',
      value: CryptoJS.SHA512(input).toString(CryptoJS.enc.Base64),
    },
  ]
})

function clearString() {
  inputString.value = ''
}
</script>
