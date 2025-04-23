<template>
  <footer class="default-footer flex flex-col items-center text-black">
    <div class="footer">
      <div class="text-white max-md:hidden">{{ t("footer-1") }}</div>
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
      <div class="text-white">© 2025 VELOZA. All rights reserved.</div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import LanguageSwitchter from "./language-switchter.vue";
const { t } = useI18n();
const scrollViews = ref<HTMLElement>();
const isHovered = ref(false);
const store = useAppStore();
watch(
  () => store.selectIndex,
  () => {
    if (store.selectIndex == "3" && scrollViews.value) {
      const top = scrollViews.value.offsetTop - 130;
      window.scroll({
        top: top,
        behavior: "smooth",
      });
    }
  }
);
const menuList = [4, 3, 4, 1];
</script>
<style lang="scss" scoped>
.footer {
  // color: #d7c87b;
  background: #cf0708;
  width: 100%;
  align-items: center;
  @apply flex justify-around px-[302px] h-[144px] text-[14px] max-2xl:px-[242px] max-2xl:h-[115px] max-2xl:text-[11px] max-xl:px-[201px] max-xl:h-[96px] max-xl:text-[9px] max-lg:px-[161px] max-lg:h-[77px] max-lg:text-[7px] max-md:flex-col max-md:py-[32px] max-md:px-0 max-md:h-[144px] max-md:text-[10px];

  .head-logo {
    @apply ml-[126px] max-2xl:ml-[98px] max-xl:ml-[81px] max-lg:ml-[65px] max-md:ml-0 max-lg:gap-[20px] max-xl:gap-[25px] max-2xl:gap-[30px] gap-[39px] max-md:gap-[16px] mr-[126px] max-2xl:mr-[98px] max-xl:mr-[81px] max-lg:mr-[65px] max-md:mr-[0px];

    img {
      @apply h-[20px] max-2xl:h-[15px] max-xl:h-[12px] max-lg:h-[10px] max-md:h-[14px];
    }
  }
}
</style>
