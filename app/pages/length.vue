<template>
  <div>
    <h1>文字数カウントツール</h1>
    <div>
      フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。
    </div>
    <br />
    <v-textarea v-model="inputString" variant="solo" />
    <v-btn @click="clearString">クリア</v-btn>
    <br />
    <v-data-table
      :headers="commonDataTableHeaders"
      :items="resultDataTableItems"
      :items-per-page="-1"
      hide-default-footer
    />
    <br />
    <h2>解説</h2>
    <h3>UTF-8ユニット数</h3>
    <div>
      UTF-8ユニット数は現在最も標準的に使われる文字コードであるUTF-8で表現した際のユニット数です。UTF-8の1ユニットは1バイトなのでバイト数と同一です。ASCII文字が1、多くの日本語文字が3になりますが、絵文字などは4以上になるものもあります。
    </div>
    <h3>UTF-16ユニット数</h3>
    <div>
      UTF-16ユニット数はJavascriptやJavaの内部表現などに用いられる文字コードであるUTF-16で表現した際のユニット数です。半角文字・全角文字ともに1と数えられるものが多いですが、絵文字などは2以上に数えられるものがあります。
    </div>
    <h3>Unicodeコードポイント数</h3>
    <div>
      Unicodeコードポイント数は、Unicodeで定められたまとまりの単位の数を表します。多くの文字が1と数えられますが、前後のUnicodeコードポイントと合わせて1文字を表す場合もあります。
    </div>
    <h3>書記素数</h3>
    <div>
      複数の絵文字を結合した結合絵文字などを含めて、「書記言語において意味上の区別を可能にする最小の図形単位をいう」(<a
        href="https://ja.wikipedia.org/wiki/%E6%9B%B8%E8%A8%98%E7%B4%A0"
        >wikipedia:書記素</a
      >)とされます。非エンジニアの方の感覚でいう「文字数」に最も近いものになります。
    </div>
    <h3>twitter文字数</h3>
    <div>
      twitterの140文字制限では、ASCII文字は0.5文字、それ以外の文字は1文字と数えられますが、URLは13.5文字と数えられます。
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommonDataTableHeaders, CommonDataTableItem } from '~/types/table'

const description =
  'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。'

useSeoMeta({
  title: '文字数カウントツール',
  description,
  ogSiteName: 'nanananakam-webtools',
  ogType: 'article',
  ogTitle: '文字数カウントツール',
  ogDescription: description,
  ogUrl: 'https://webtools.nanananakam.com/length/',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://webtools.nanananakam.com/length/' },
  ],
})

const UNSUPPORTED_SEGMENTER =
  'このブラウザではIntl.Segmenterがサポートされていません。Google Chrome最新版をご利用ください。'
const UNSUPPORTED_TEXT_ENCODER =
  'このブラウザではTextEncoderがサポートされていません。Google Chrome最新版をご利用ください。'

const textEncoder =
  typeof TextEncoder !== 'undefined' ? new TextEncoder() : null
const segmenter =
  'Segmenter' in Intl
    ? new Intl.Segmenter('ja', { granularity: 'grapheme' })
    : null

const inputString = ref(
  '例えば👨‍👩‍👧‍👦のような絵文字が含まれたり、https://webtools.nanananakam.com/length/などURLが含まれる場合でもそれぞれの数え方で正しく数えることができます。',
)

const commonDataTableHeaders: CommonDataTableHeaders = [
  { title: 'カウント方法', key: 'key', sortable: false },
  { title: '文字数', key: 'value', sortable: false },
]

const jsLength = computed<number>(() => inputString.value.length)

const codePointsNum = computed<number>(() => [...inputString.value].length)

const graphemeNum = computed<number | string>(() => {
  if (segmenter == null) {
    return UNSUPPORTED_SEGMENTER
  }
  return [...segmenter.segment(inputString.value)].length
})

const utf8ByteNum = computed<number | string>(() => {
  if (textEncoder == null) {
    return UNSUPPORTED_TEXT_ENCODER
  }
  return textEncoder.encode(inputString.value).byteLength
})

const twitterNumString = computed<string>(() => {
  if (segmenter == null) {
    return UNSUPPORTED_SEGMENTER
  }
  if (textEncoder == null) {
    return UNSUPPORTED_TEXT_ENCODER
  }
  const urlRegex =
    /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
  // URLは半角23文字相当となる
  const urlReplacedInputValue = inputString.value.replace(
    urlRegex,
    '12345678901234567890123',
  )
  const twitterNum = [...segmenter.segment(urlReplacedInputValue)]
    .map((s) => (textEncoder.encode(s.segment).byteLength === 1 ? 0.5 : 1))
    .reduce((a, b) => a + b, 0)
  return twitterNum.toString() + '/140'
})

const resultDataTableItems = computed<CommonDataTableItem[]>(() => [
  { key: 'UTF-8ユニット数(=Byte数)', value: utf8ByteNum.value.toString() },
  {
    key: 'UTF-16ユニット数(javascriptのlength)',
    value: jsLength.value.toString(),
  },
  { key: 'Unicodeコードポイント数', value: codePointsNum.value.toString() },
  { key: '書記素数', value: graphemeNum.value.toString() },
  { key: 'twitter文字数(URL対応)', value: twitterNumString.value },
])

function clearString() {
  inputString.value = ''
}
</script>
