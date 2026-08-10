export default {
  // Target: https://go.nuxtjs.dev/config-target
  // Cloudflare Pagesは静的ホスティングのため、staticターゲットで生成する。
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - nanananakam-webtools',
    title: 'nanananakam-webtools',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Web開発・運用であるとうれしいちょっとしたツール集です。' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    //link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-gtag',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/sitemap',
    'vue-social-sharing/nuxt'
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
    },
    defaultAssets: {
      icons: "mdiSvg",
      font: false,
    }
  },

  "google-fonts": {
    families: {
      Roboto: true
    },
    download: true,
    inject: true
  },

  "google-gtag": {
    id: "G-BKHJMCZ8H1",
    debug: true
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://webtools.nanananakam.com',
    filter ({ routes }) {
      return routes.map(route => {
        route.url = `${route.url}/`
        return route
      })
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Static generate configuration
  // Cloudflare Pagesのビルド出力ディレクトリとして dist を使う。
  generate: {
    dir: 'dist',
    fallback: '404.html',
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  router: {
    trailingSlash: true
  }
}
