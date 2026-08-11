import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'light',
    },
    // アイコンフォントを読み込まず、@mdi/js のSVGパスだけを利用する。
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
