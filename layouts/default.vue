<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="text-right">
          <a href="https://b.hatena.ne.jp/entry/" class="hatena-bookmark-button"
             data-hatena-bookmark-layout="basic-label" data-hatena-bookmark-lang="ja"
             title="このエントリーをはてなブックマークに追加"><img
            src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" alt="このエントリーをはてなブックマークに追加"
            width="20" height="20" style="border: none;"/></a>
          <script type="text/javascript" src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8"
                  async="async"></script>
        </div>
        <div class="share_buttons text-right">　
          <ShareNetwork
            network="twitter"
            :url="url"
            :title="title"
            :description="title"
          >
          <v-icon large>{{ mdiTwitter }}</v-icon>
          </ShareNetwork>
          <ShareNetwork
            network="facebook"
            :url="url"
            :title="title"
            :description="title"
          >
            <v-icon large>{{ mdiFacebook }}</v-icon>
          </ShareNetwork>
          <button v-if="isNavigatorShareButton" @click="navigatorShare">
            <v-icon large>{{ mdiShare }}</v-icon>
          </button>
        </div>
        <Nuxt/>
        <v-row>
          <v-col v-for="item in items" cols="12" md="6" lg="4" xl="3">
            <v-card>
              <v-card-title><a :href="item.to">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.title }}</a></v-card-title>
              <v-card-text>{{ item.text }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; 2022-{{ new Date().getFullYear() }} <a href="https://github.com/nanananakam/webtools-static">nanananakam</a></span>
      <span class="ml-5"><a href="/about/">プライバシーポリシー・免責事項</a></span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
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
} from "@mdi/js";

interface PageInfo {
  icon: string,
  title: string,
  to: string,
  text: string,
}

const pagesInfo: PageInfo[] = [
  {
    icon: mdiClockOutline,
    title: 'UnixTime便利ツール',
    to: '/unixtime/',
    text: "UnixTimeを始めとした様々な形式で時刻を入力し、形式変換やTimeZone変更、加減算ができます。"
  },
  {
    icon: mdiCounter,
    title: '文字数カウントツール',
    to: '/length/',
    text: "フォームに入力された文字数を各種エンコードでのユニット数、Unicodeのコードポイント数、書記素数、twitter文字数制限での換算数でそれぞれ表示します。"
  },
  {
    icon: mdiArrowCollapseVertical,
    title: "文字列ハッシュ化ツール",
    to: '/hash/',
    text: "入力された文字列をmd5,sha1,sha256でハッシュ化し、HEX形式,Base64形式で出力します。"
  },
  {
    icon: mdiArrowCollapseVertical,
    title: "ファイルハッシュ確認ツール",
    to: '/hashFile/',
    text: "入力されたファイルのmd5,sha1,sha256,sha512ハッシュをHEX形式またはBase64形式で出力します。"
  },
  {
    icon: mdiFileArrowLeftRightOutline,
    title: "Base64文字列ツール",
    to: '/base64/',
    text: "フォームに入力された文字列をBase64に変換、またはBase64から文字列に変換します。"
  },
  {
    icon: mdiFileArrowLeftRightOutline,
    title: "ファイルBase64ツール",
    to: '/fileBase64/',
    text: "入力されたファイルをBase64に変換、またはBase64からファイルに変換します。"
  },
  {
    icon: mdiQrcodeEdit,
    title: "QRコード作成ツール",
    to: "/qrcode/",
    text: "入力された文字列からQRコードを作成します。ダウンロードもできます。誤り訂正レベルを選択できます。"
  },
  {
    icon: mdiInformation,
    title: "このサイトについて",
    to: '/about/',
    text: "このサイトについて・プライバシーポリシー・免責事項"
  },
]

export default Vue.extend({
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: pagesInfo,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      isNavigatorShareButton: true,
      mdiShare: mdiShare,
      mdiTwitter: mdiTwitter,
      mdiFacebook: mdiFacebook,
    }
  },
  mounted() {
    if (navigator.share === undefined) {
      this.isNavigatorShareButton = false
    }
  },
  methods: {
// Web Share APIが使える場合
    navigatorShare() {
      if (navigator.share) {
        navigator.share({
          title: this.title,
          text: this.title,
          url: this.url
        })
      }
    },
  },
  computed: {
    title(): string {
      for (let pageInfo of pagesInfo) {
        if (this.$route.fullPath.startsWith(pageInfo.to)) {
          return pageInfo.title
        }
      }
      return "nanananakam webtools"
    },
    url(): string {
      return "https://webtools.nanananakam.com" + this.$route.fullPath
    }
  }
})
</script>
