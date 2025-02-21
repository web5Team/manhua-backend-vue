<template>
  <div class="swiper-wrapper__inner">
    <!-- 顶部按钮轮播 -->
    <!-- <ClientOnly>
      <swiper-container
        ref="buttonSwiper"
        class="swiper-buttons"
        :loop="false"
        :space-between="0"
        :centered-slides="false"
        :breakpoints="{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 3.5 },
        }"
      >
        <swiper-slide
          class="flex justify-center"
          v-for="(slide,index) in slides"
          :key="`button-${slide.id}`"
        >
        <button 
            class="title-item hover:!bg-white hover:!text-black"  
            @click="onButtonClick"
            :class="{'!bg-[#fff] !text-[#000]': activeIndex === index}">
            {{ slide.name }}
          </button>
        </swiper-slide>
      </swiper-container>
    </ClientOnly> -->
    <!-- 底部图片轮播 -->
    <ClientOnly>
      <swiper-container ref="imageSwiper" class="swiper-basic" :loop="false" :space-between="18" :slidesPerView="2"
        :initial-slide="1" :centeredSlides="true" :scrollbar="false" @swiper="onSwiperInit"
        @activeIndexChange="onImageSlideChange">
        <swiper-slide @click="nextSlide(index)" v-for="(slide,index) in slides" :key="`slide-basic-${slide.id as string}`"
          class="swiper-slide h-full">
          <div class="img-item">
            <img class="max-2xl:h-[291.5px]" :src="slide.img" alt="" loading="lazy" />
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// import { Swiper, SwiperSlide,useSwiper } from 'swiper/vue';
import { ref } from 'vue'
const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
})
const activeIndex = ref(0)
const buttonSwiper = ref(null)
const imageSwiper = ref(null)

const onSwiperInit = (swiperInstance: any) => {
  imageSwiper.value = swiperInstance // 手动绑定 Swiper 实例
  console.log('Swiper initialized:', imageSwiper.value)
}
const nextSlide = (index:number) => {
  imageSwiper.value.swiper.slideTo(index)
}
// 点击顶部按钮时联动底部图片轮播
const onButtonClick = (event: MouseEvent) => {
  const clickedIndex = buttonSwiper.value?.swiper.clickedIndex
  // 更新激活索引
  activeIndex.value = clickedIndex
  // 底部图片轮播滑动到对应位置
  if (clickedIndex !== undefined && imageSwiper.value?.swiper) {
    imageSwiper.value.swiper.slideToLoop(clickedIndex)
  }
  // 顶部按钮轮播联动
  if (clickedIndex !== undefined && buttonSwiper.value?.swiper) {
    buttonSwiper.value.swiper.slideTo(clickedIndex) // 滑动到目标按钮
  }
}
// 图片轮播滑动时联动顶部按钮
const onImageSlideChange = (swiper: any) => {
  const realIndex = swiper.realIndex
  if (realIndex !== undefined) {
    activeIndex.value = realIndex // 更新当前索引
    if (buttonSwiper.value?.swiper) {
      buttonSwiper.value.swiper.slideTo(realIndex)
    }
  }
}
onMounted(() => {
  // onSwiperInit()
  if (imageSwiper.value?.swiper) {
    imageSwiper.value.swiper.params.autoplay = {
      delay: 5000,
      disableOnInteraction: false,
    }
    imageSwiper.value.swiper.autoplay.start()
  }

  if (buttonSwiper.value?.swiper) {
    console.log('Button swiper initialized')
  }
})
</script>
<style lang="scss" scoped>
.swiper-buttons {
  margin-bottom: 90px;
}

.swiper-buttons .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-item {
  cursor: pointer;
  color: #fff;
  padding: 14px 30px;
  font-size: 22px;
  font-weight: 500;
  border: 1.632px solid rgba(242, 255, 238, 0.08);
  background: linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(255, 255, 255, 0.04) 100%),
    #222530;
  box-shadow: 0px 0px 19.579px 0px rgba(0, 0, 0, 0.08) inset;
  transition: background-color 0.3s ease;
}

.img-item {
  height: auto;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  align-items: center;

  // background: #FFF;
  // @apply max-md:w-full;
  img {
    width: 100%;
    height: auto;
    // @apply max-2xl:w-[291.5px] max-md:h-[214px];
  }
}
</style>
