<template>
  <div @click="store.selectIndex = index; store.clickNumPlus()" class="menu-item">
    <span class="font-bold ">{{ name }}</span>
  </div>
</template>
<script setup lang="ts">
import { type RouteLocationPathRaw } from 'vue-router'
const store = useAppStore()
const props = defineProps<{
  to?: RouteLocationPathRaw
  target?: string
  name: string
  bgColor?: string
  showActive?: boolean,
  index?: string
}>()
const route = useRoute()
const isActive = computed(() => {
  const routePath =
    route.path === '/' ? route.path : route.path.replace(/\/$/, '')
  return (
    props.to &&
    (props.to.path === route.meta.activePath ||
      (props.to.path === routePath && props.to.hash === route.hash) ||
      (props.to.path !== '/' && routePath.includes(props.to.path)))
  )
})
</script>
<style lang="scss" scoped>
.menu-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 62px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  @apply max-3xl:text-[14px] max-2xl:text-[11px] max-xl:text-[9px] max-lg:text-[7px] font-bold hover:text-[#D7C87B];
}
</style>
