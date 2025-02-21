import { defineStore } from 'pinia'

interface AppSate {
  showMenu: boolean
  locale: String
  selectIndex: string
  clickNum: number
}
export const useAppStore = defineStore({
  id: 'appStore',
  state: (): AppSate => ({
    showMenu: false,
    locale: '',
    selectIndex: '0',
    clickNum: 0,
  }),
  getters: {},
  actions: {
    //展示菜单
    toggleMenu() {
      this.showMenu = !this.showMenu
      console.log(this.showMenu)
    },
    //设置语言
    async setLocale(locale: string) {
      this.locale = locale
    },
    clickNumPlus() {
      this.clickNum++
      console.log(this.clickNum)
    },
  },
})
