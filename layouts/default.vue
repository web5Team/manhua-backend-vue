<template>
  <div class="default-home-page">
    <el-header height="auto" style="padding: 0" class="head sticky top-0 z-[999]">
      <Header></Header>
    </el-header>
    <!-- 侧边菜单 -->
    <MobileMenu v-show="appStore.showMenu" />
    <el-container>
      <el-main style="position: relative; padding: 0;">
        <slot />
      </el-main>
      <el-footer ref="footerRef" height="auto">
        <Footer />
      </el-footer>
    </el-container>

  </div>
</template>

<script lang="ts" setup>
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import MobileMenu from './components/mobile-menu.vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
const route = useRoute()
const appStore = useAppStore()
const isScrolledToBottom = ref(false);
const footerRef = ref<HTMLElement | null>(null)

const checkScrollPosition = () => {
  const scrollTop = window.scrollY
  const viewportHeight = window.innerHeight
  const totalHeight = document.documentElement.scrollHeight
  isScrolledToBottom.value = scrollTop + viewportHeight >= totalHeight - 1000
}

onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
})
</script>

<style scoped>
.default-home-page {
  .header-bg {
    position: relative;
    width: 45%;
    height: auto;
    flex-shrink: 0;
    /* filter: blur(8px); */
    position: fixed;
    right: 0;
    top: -10%;
    z-index: 0;
    /* mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%); */
    @apply max-md:top-0;

    .video-background {
      position: absolute;
      /* 使视频层位于背景 */
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      object-fit: cover;
      /* 让视频充满背景区域 */
      /* z-index: 0; */
    }
  }
}

.el-footer {
  padding: 0;
}

.head {
  background: linear-gradient(to right, #4C51F0, #C152D2);
}
</style>
