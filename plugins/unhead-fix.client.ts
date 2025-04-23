// plugins/unhead-fix.client.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // 提供一个临时的 getActiveHead 函数
  // @ts-ignore
  window.getActiveHead = () => {
    console.warn('getActiveHead is deprecated and has been stubbed')
    return {}
  }
})
