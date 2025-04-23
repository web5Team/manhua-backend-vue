<template>
  <header class="layout-header">
    <div
      class="header-contain justify-center max-md:justify-between max-md:w-full max-md:px-[19px]"
    >
      <div>
        <img
          class="w-[135px] max-2xl:w-[104px] max-xl:w-[87px] max-lg:w-[30px] max-md:w-[101px] h-auto"
          src="@/assets/icons/icon.png"
          alt=""
        />
      </div>
      <div class="right-menu">
        <div class="menu-list">
          <MenuItem
            class="flex-none"
            v-for="(item, index) in 3"
            :key="index"
            :name="t(`head-${index + 1}`)"
            :show-active="true"
            :index="index + ''"
          >
          </MenuItem>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="flex items-center justify-center head-logo">
          <img src="@/assets/images/head-1.png" alt="" />
          <NuxtLink to="https://t.me/veloza_award" target="_blank">
            <img src="@/assets/images/head-2.png" alt="" />
          </NuxtLink>
          <NuxtLink to="https://x.com/veloza_award" target="_blank">
            <img src="@/assets/images/head-3.png" alt="" />
          </NuxtLink>
          <img src="@/assets/images/head-4.png" alt="" />
        </div>
        <div
          class="max-md:hidden flex justify-center items-center gap-[4px] max-2xl:gap-[3px] max-xl:gap-[3px] max-md:gap-[3px]"
        >
          <LanguageSwitcher
            style="--el-text-color-regular: white"
            :show-title="false"
            class="language-btn text-white"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
          >
          </LanguageSwitcher>
          <img
            class="w-[9px] max-2xl:w-[7px] max-xl:w-[6px] max-lg:w-[5px]"
            src="@/assets/icons/down.png"
          />
        </div>
        <div class="hidden max-md:flex justify-center gap-2">
          <!-- <div class="flex items-center gap-4">
            <LanguageSwitcher :show-title="false" class="language-btn !text-white" @mouseover="isHovered = true"
              @mouseleave="isHovered = false">
            </LanguageSwitcher>
            <div @click="toggleMenu">
              <img src="@/assets/icons/menu.svg" class="h-6 w-6" alt="">
            </div>
          </div> -->
          <div class="flex justify-center gap-1">
            <LanguageSwitcher
              style="--el-text-color-regular: white"
              :show-title="false"
              class="language-btn !text-[16px] text-white"
              @mouseover="isHovered = true"
              @mouseleave="isHovered = false"
            >
            </LanguageSwitcher>
            <img class="w-[10px]" src="@/assets/icons/down.png" />
          </div>

          <img
            @click="toggleMenu"
            src="@/assets/icons/menu.svg"
            class="w-[15px]"
            alt=""
          />
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { Menu } from "@element-plus/icons-vue";
import LanguageSwitcher from "./language-switchter.vue";
import MenuItem from "./menu-item.vue";
import { useRoute } from "vue-router";
import { useAppStore } from "~/stores/app";
import { ref } from "vue";
const appStore = useAppStore();
const route = useRoute();
const isHovered = ref(false);
const { t } = useI18n();
const menu = [
  {
    name: "home",
    is_show: "1",
    link: {
      path: "/",
      hash: "",
    },
  },
  {
    name: "contact",
    is_show: "1",
    link: {
      path: "/",
      hash: "",
    },
  },
  {
    name: "tickts",
    is_show: "1",
    link: {
      path: "/",
      hash: "",
    },
  },
];
const toggleMenu = () => {
  appStore.toggleMenu();
};
</script>

<style lang="scss" scoped>
.layout-header {
  z-index: 1999;
  // position: fixed;
  top: 0;
  background-color: #cf0708;
  width: 100%;
  @apply h-[101px] max-2xl:h-[78px] max-xl:h-[65px] max-lg:h-[52px] max-md:h-[78px];
  @apply max-md:bg-[#111111];
  .header-contain {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 auto;
  }

  .right-menu {
    position: relative;
    box-sizing: center-box;
    display: flex;
    // gap: 130px;
    align-items: center;
    justify-content: flex-end;
    padding: 6px 0;
    @apply max-md:hidden;

    .menu-list {
      display: flex;
      flex: 1 1 0%;
      justify-content: end;
      align-items: center;
      gap: 30px;
      @apply ml-[261px] max-2xl:ml-[202px] max-xl:ml-[169px] max-lg:ml-[135xp] gap-[126px] max-2xl:gap-[98px] max-xl:gap-[81px] max-lg:gap-[65px] max-md:hidden;
    }
  }

  .head-logo {
    @apply ml-[126px] max-2xl:ml-[98px] max-xl:ml-[81px] max-lg:ml-[65px] max-md:ml-0 max-lg:gap-[20px] max-xl:gap-[25px] max-2xl:gap-[30px] gap-[39px] max-md:gap-[16px] mr-[126px] max-2xl:mr-[98px] max-xl:mr-[81px] max-lg:mr-[65px] max-md:mr-[30px];

    img {
      @apply h-[20px] max-2xl:h-[15px] max-xl:h-[12px] max-lg:h-[10px] max-md:h-[14px];
    }
  }
}

.language-btn {
  display: flex;
}
</style>
