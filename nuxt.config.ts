import type { PluginOption } from 'vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',

  // 全ページを事前生成する静的サイトなので、SSR(=プリレンダリング)を有効にする。
  ssr: true,

  // サイト全体の情報。@nuxtjs/sitemap が参照する。
  site: {
    url: 'https://webtools.nanananakam.com',
    name: 'nanananakam-webtools',
    trailingSlash: true,
  },

  // Global page headers: https://nuxt.com/docs/api/nuxt-config#head
  app: {
    head: {
      titleTemplate: '%s - nanananakam-webtools',
      title: 'nanananakam-webtools',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Web開発・運用であるとうれしいちょっとしたツール集です。',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Roboto はセルフホストする (外部への追加リクエストを発生させない)。
  css: [
    '@fontsource/roboto/400.css',
    '@fontsource/roboto/500.css',
    '@fontsource/roboto/700.css',
  ],

  modules: [
    // Vuetify は Vite プラグインとして組み込み、コンポーネントを自動インポートする。
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        const plugins = (config.plugins ?? []) as PluginOption[]
        plugins.push(vuetify({ autoImport: true }))
        Object.assign(config, { plugins })
      })
    },
    '@nuxtjs/sitemap',
    'nuxt-gtag',
    '@nuxt/eslint',
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  gtag: {
    id: 'G-BKHJMCZ8H1',
    config: {
      debug_mode: process.env.NODE_ENV !== 'production',
    },
  },

  sitemap: {
    // 各ページは末尾スラッシュ付きのURLで配信している。
    autoLastmod: false,
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  nitro: {
    // Cloudflare Pages のビルド出力ディレクトリとして dist を使う。
    output: {
      publicDir: 'dist',
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      // SPAフォールバック用に 404.html を生成する。
      failOnError: true,
    },
  },

  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
