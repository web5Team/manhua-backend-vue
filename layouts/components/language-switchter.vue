<template>
  <ElDropdown class="language-btn" :class="{ 'is-hovered': isHovered }" @mouseover="isHovered = true"
    @mouseleave="isHovered = false" trigger="click">
    <span class="flex items-center font-[600]">
      <slot name="prefix-icon"></slot>
      <div class=" font-bold text-bold max-3xl:text-[13px] max-2xl:text-[11px] max-xl:text-[9px] max-lg:text-[7px] ellipsis max-md:text-[16px] max-md:w-[30px]">{{ languageName == 'English' ? 'EN' : languageName }}
      </div>
      <el-icon class="text-[#282943]" v-if="props.showIcon"><ElIconCaretBottom /></el-icon>
      <!-- <img  class="w-[9px] h-[5px]" src="@/assets/icons/down.svg" alt="" /> -->
    </span>
    <template #dropdown>
      <ElDropdownMenu class="hover-item" >
        <ElDropdownItem v-for="availableLocale in availableLocales" :key="availableLocale.code"
          @click="handClick(availableLocale.code)">
          {{ availableLocale.name }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts" setup>
import { useI18n, LocaleObject, useSwitchLocalePath } from '#i18n'
import { useAppStore } from '@/stores/app'
const props = defineProps({
  showTitle: {
    type: Boolean,
    default: false
  },
  showIcon:Boolean
})
const isHovered = ref(false)

const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() => {
  return locales.value as LocaleObject[]
})
const languageName = computed(() => {
  return (locales.value as LocaleObject[]).find(
    (i) => i.code === locale.value
  ).name
})

const userStore = useAppStore()
const handClick = async (value: any) => {
  setLocale(value)
  await userStore.setLocale(value)
  const refreshing = ref(false)
  const refreshAll = async () => {
    refreshing.value = true
    try {
      await refreshNuxtData()
    } finally {
      refreshing.value = false
    }
  }
  await refreshAll()
}
onMounted(() => {
  if (locales.value) handClick(locales.value[0].code)
})

</script>
<style lang="scss" scoped>
.language-btn {
  display: flex;
  transition: all 0.3s ease;
}
.ellipsis {
  white-space: nowrap;           
  overflow: hidden;              
  text-overflow: ellipsis;      
}


.language-btn .el-dropdown__menu {
  visibility: hidden;
  transition: all 0.3s ease;
}

.language-btn.is-hovered .el-dropdown__menu {
  visibility: visible;
}

.hover-item {
  --el-dropdown-menuItem-hover-fill: white;
  --el-dropdown-menuItem-hover-color: var(--el-color-orange);
}
</style>
