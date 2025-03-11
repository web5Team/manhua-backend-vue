<template>
  <ElConfigProvider v-bind="config">
    <NuxtLoadingIndicator color="#4a5dff" :height="2" />
    <NuxtPage />
  </ElConfigProvider>
</template>
<script lang="ts" setup>
import zh_CN from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'
import { ID_INJECTION_KEY, ElConfigProvider } from 'element-plus'
const { locale, t } = useI18n()
provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0
})
const copeLanguage = () => {
  const lang = locale.value
  switch (lang) {
    case 'zh-CN':
      return zh_CN
    case 'en':
      return en
    case 'ja':
      return ja
  }
}
watch(
  () => locale.value,
  (val) => {
    config.locale = copeLanguage()
  }
)

const config = reactive({
  locale: copeLanguage()
})
useHead({
  title: 'veloza',
  meta: [
    { name: 'description', content: '' },
    { name: 'keywords', content: '' }
  ],
  // link: [
  //   {
  //     rel: 'shortcut icon',
  //     type: 'image/x-icon',
  //     href: '/favicon.ico',
  //   },
  // ],
  // script: [
  //     {
  //         src: 'https://www.googletagmanager.com/gtag/js?id=G-9B9QR8H6JG',
  //         async: true
  //     },
  //     {
  //         innerHTML: `
  //         window.dataLayer = window.dataLayer || [];
  //         function gtag(){dataLayer.push(arguments);}
  //         gtag('js', new Date());

  //         gtag('config', 'G-9B9QR8H6JG');
  //       `
  //     }
  // ]
})
</script>