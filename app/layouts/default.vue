<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="share_buttons text-right">
          <a
            :href="twitterShareUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="'Twitterで共有: ' + title"
          >
            <v-icon size="large" :icon="mdiTwitter" />
          </a>
          <a
            :href="facebookShareUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="'Facebookで共有: ' + title"
          >
            <v-icon size="large" :icon="mdiFacebook" />
          </a>
          <button
            v-if="isNavigatorShareButton"
            aria-label="このページを共有"
            @click="navigatorShare"
          >
            <v-icon size="large" :icon="mdiShare" />
          </button>
        </div>
        <slot />
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.to"
            cols="12"
            md="6"
            lg="4"
            xl="3"
          >
            <v-card>
              <v-card-title
                ><a :href="item.to">
                  <v-icon :icon="item.icon" />
                  {{ item.title }}</a
                ></v-card-title
              >
              <v-card-text>{{ item.text }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
      <span
        >&copy; 2022-{{ currentYear }}
        <a href="https://github.com/nanananakam/webtools-static">nanananakam</a>
      </span>
      <span class="ml-5"
        ><a href="/about/">プライバシーポリシー・免責事項</a></span
      >
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import {
  mdiClockOutline,
  mdiInformation,
  mdiCounter,
  mdiArrowCollapseVertical,
  mdiFileArrowLeftRightOutline,
  mdiQrcodeEdit,
  mdiShare,
  mdiTwitter,
  mdiFacebook,
} from '@mdi/js'

interface PageInfo {
  icon: string
  title: string
  to: string
  text: string
}

const pagesInfo: PageInfo[] = [
  {
    icon: mdiClockOutline,
    title: 'UnixTime便利ツール',
    to: '/unixtime/',
    text: 'UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。',
  },
  {
    icon: mdiCounter,
    title: '文字数カウントツール',
    to: '/length/',
    text: 'フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。',
  },
  {
    icon: mdiArrowCollapseVertical,
    title: '文字列ハッシュ化ツール',
    to: '/hash/',
    text: '入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。',
  },
  {
    icon: mdiArrowCollapseVertical,
    title: 'ファイルハッシュ確認ツール',
    to: '/hashFile/',
    text: '入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。',
  },
  {
    icon: mdiFileArrowLeftRightOutline,
    title: 'Base64文字列ツール',
    to: '/base64/',
    text: 'フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。',
  },
  {
    icon: mdiFileArrowLeftRightOutline,
    title: 'ファイルBase64ツール',
    to: '/fileBase64/',
    text: '入力されたファイルをBase64に変換、またはBase64からファイルに変換します。',
  },
  {
    icon: mdiQrcodeEdit,
    title: 'QRコード作成ツール',
    to: '/qrcode/',
    text: '入力された文字列からQRコードを作成します。ダウンロードもできます。誤り訂正レベルを選択できます。',
  },
  {
    icon: mdiInformation,
    title: 'このサイトについて',
    to: '/about/',
    text: 'このサイトについて・プライバシーポリシー・免責事項',
  },
]

const route = useRoute()

const items = pagesInfo
const currentYear = new Date().getFullYear()
const isNavigatorShareButton = ref(false)

const title = computed<string>(() => {
  for (const pageInfo of pagesInfo) {
    if (route.fullPath.startsWith(pageInfo.to)) {
      return pageInfo.title
    }
  }
  return 'nanananakam webtools'
})

const url = computed<string>(
  () => 'https://webtools.nanananakam.com' + route.fullPath,
)

const twitterShareUrl = computed<string>(
  () =>
    'https://twitter.com/intent/tweet?url=' +
    encodeURIComponent(url.value) +
    '&text=' +
    encodeURIComponent(title.value),
)

const facebookShareUrl = computed<string>(
  () =>
    'https://www.facebook.com/sharer/sharer.php?u=' +
    encodeURIComponent(url.value),
)

onMounted(() => {
  isNavigatorShareButton.value = navigator.share !== undefined
})

// Web Share APIが使える場合
function navigatorShare() {
  if (navigator.share) {
    navigator
      .share({
        title: title.value,
        text: title.value,
        url: url.value,
      })
      .catch(() => {
        // 共有がキャンセルされた場合は何もしない
      })
  }
}
</script>
