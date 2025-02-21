<template>
  <!-- 侧边菜单 -->
  <div class="menus top-0 left-0 !h-[100vh] w-full z-9999">
    <div class="h-full px-[52px] pt-[80px]">
      <ul class="space-y-8">
        <li @click="toView(index)" class="text-[24px] text-white font-[700]" v-for="(item, index) in 3" :key="index" :name="$t(`head-${index + 1}`)">
          {{ $t(`head-${index + 1}`) }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '~/stores/app'
const appStore = useAppStore()
const menu = [
  {
    name: 'home',
    is_show: '1',
    link: {
      path: '/',
      hash: '',
    },
  },
  {
    name: 'about',
    is_show: '1',
    link: {
      path: '/about',
      hash: '',
    },
  },
  {
    name: 'contact',
    is_show: '1',
    link: {
      path: '/contact',
      hash: '',
    },
  },
  {
    name: 'partners',
    is_show: '1',
    link: {
      path: '/partners',
      hash: '',
    },
  },
]
// 定义关闭菜单的函数
const closeMenu = () => {
  appStore.showMenu = false
}
const toView = (index: number) => {
  appStore.showMenu = false;
  setTimeout(() => {
    appStore.selectIndex = index+''; 
    appStore.clickNumPlus()
  }, 0);
}
</script>
<style lang="scss" scoped>
.menus {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2147483647;
  background: #25241f;
  margin-top: 66px;
}
</style>
