// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'velosa',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  compatibilityDate: '2025-02-15',
  devtools: { enabled: true },
  css: ['@/assets/styles/index.scss'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    'nuxt-swiper',
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
    },
  },
  elementPlus: {
    /** Options */
  },
  i18n: {
    strategy: 'no_prefix',

    locales: [
      {
        code: 'en',
        file: 'en-US.json',
        name: 'English',
      },
      {
        code: 'zh-CN',
        file: 'zh-CN.json',
        name: '简体中文',
      },
      // {
      //     code: 'ja',
      //     file: 'ja.json',
      //     name: '日本語'
      // }
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },

    // fallbackLocale: 'ja'
  },
  ssr: false,
  devServer: {
    port: 4000,
  },
})
