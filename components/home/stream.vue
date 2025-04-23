<script lang="ts" setup>
const { t } = useI18n();
const streamImgUrl1 = (index: number) => {
  return new URL(`/assets/images/home-stream-${index + 1}.png`, import.meta.url)
    .pathname;
};

const streamImgUrl2 = (index: number) => {
  return new URL(
    `/assets/images/home-stream-2-${index + 1}.png`,
    import.meta.url
  ).pathname;
};

const streamImgUrl3 = (index: number) => {
  const indexList = [2, 3, 7, 6, 10, 11];
  if (index == 6)
    return new URL(`/assets/images/home-stream-2-${2}.png`, import.meta.url)
      .pathname;
  return new URL(
    `/assets/images/home-stream-${indexList[index]}.png`,
    import.meta.url
  ).pathname;
};
</script>
<template>
  <div class="home-stream overflow-hidden flex-center">
    <div
      class="overflow-hidden w-[1920px] max-2xl:w-[1536px] max-xl:w-[1280px] max-md:w-[1024px]"
    >
      <div
        class="h-[1257px] mt-[292px] max-2xl:mt-[219px] max-2xl:h-[944px] max-xl:h-[672px] max-xl:mt-[195px] max-md:h-[671px] max-md:mt-[156px] w-full relative overflow-hidden max-md:hidden img-List"
      >
        <div
          v-for="(_, index) in 14"
          :class="`child-${index + 1}`"
          class="relative"
          :key="_"
        >
          <img
            :src="streamImgUrl1(index)"
            class="w-full h-full"
            :class="[[2, 5, 10].includes(index) ? '' : 'grayscale-[1]']"
            alt=""
          />
          <div
            :class="index == 5 ? 'text-[#F0EDDD]' : 'text-[#313341]'"
            class="text-center font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-[38px] max-2xl:px-[30px] max-xl:px-[26px] max-lg:px-[18px]"
            v-if="[2, 5, 10].includes(index)"
          >
            <div
              :class="
                index == 10
                  ? 'mb-[25px] max-2xl:mb-[20px] max-xl:mb-[17px] max-lg:mb-[13px]'
                  : 'mb-[38px] max-2xl:mb-[30px] max-xl:mb-[17px] max-lg:mb-[20px]'
              "
              class="text-[50px] max-2xl:text-[40px] max-xl:text-[33px] max-lg:text-[27px]"
            >
              {{ t(`stream-${index == 2 ? 1 : index == 5 ? 3 : 5}`) }}
            </div>
            <div
              class="text-[20px] max-2xl:text-[16px] max-xl:text-[13px] max-lg:text-[11px]"
            >
              {{ t(`stream-${index == 2 ? 2 : index == 5 ? 4 : 6}`) }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="hidden max-md:flex px-[19px] w-full mt-[79px] img-List-mobile"
      >
        <div v-for="(_, index) in 7" :key="index" class="relative">
          <img class="w-full h-full" :src="streamImgUrl3(index)" alt="" />
          <div
            v-if="[1, 3, 5, 6].includes(index)"
            :class="
              ![3, 6].includes(index) ? 'text-[#313341]' : 'text-[#F0EDDD]'
            "
            class="flex flex-col items-center text-center font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-[36px]"
          >
            <div
              :class="index == 5 ? 'mb-[20px] w-[196px]' : 'mb-[27px]'"
              class="text-[32px]"
            >
              {{ t(`stream-${index == 6 ? 7 : index}`) }}
            </div>
            <div class="text-[12px]">
              {{ t(`stream-${(index == 6 ? 7 : index) + 1}`) }}
            </div>
          </div>
        </div>
        <div
          style="background: none"
          class="flex flex-col mobile-stream gap-[6px] h-full"
        >
          <div class="flex gap-[6px]">
            <div class="bg-[#f0f0f0] w-[36.7%]">
              <img src="@/assets/images/home-stream-2-3.png" alt="" />
            </div>
            <div class="bg-[#f0f0f0] flex-1 w-full">
              <img src="@/assets/images/home-stream-2-4.png" alt="" />
            </div>
          </div>
          <div class="flex gap-[6px]">
            <div class="w-[51.6%]">
              <div class="bg-[#f0f0f0] w-full h-[108px] mb-[6px]">
                <img src="@/assets/images/home-stream-2-7.png" alt="" />
              </div>
              <div
                class="bg-[#2C2D34] text-[12px] w-full h-[43px] rounded-[10px] flex justify-center items-center font-bold"
              >
                {{ t("stream-9") }}
              </div>
            </div>
            <div class="bg-[#f0f0f0] flex-1 w-full h-[157px]">
              <img src="@/assets/images/home-stream-2-8.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="img-List-2 overflow-hidden max-md:hidden">
        <div
          v-for="(_, index) in 9"
          :class="`child-${index + 1} relative`"
          :key="_"
        >
          <img
            v-if="index !== 8"
            :class="[index !== 1 ? 'grayscale-[1]' : '']"
            :src="streamImgUrl2(index)"
            alt=""
          />

          <div
            v-if="index == 1"
            class="text-center font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center"
          >
            <div
              class="text-[40px] mb-[38px] max-2xl:text-[40px] max-2xl:mb-[30px] max-xl:text-[33px] max-xl:mb-[25px] max-lg:text-[27px] max-lg:mb-[20px]"
            >
              {{ t("stream-7") }}
            </div>
            <div
              class="text-[20px] px-[32px] max-2xl:text-[16px] max-2xl:px-[26px] max-xl:text-[13px] max-xl:px-[21px] max-lg:text-[11px] max-lg:px-[17px]"
            >
              {{ t("stream-8") }}
            </div>
          </div>
          <div
            class="bg-[#be0a0b] flex justify-center items-center font-bold h-full text-[29px] rounded-[10px] max-2xl:text-[23px] max-2xl:rounded-[8px] max-xl:text-[19px] max-xl:rounded-[7px] max-lg:text-[15px] max-lg:rounded-[5px]"
            v-if="index === 8"
          >
            {{ t("stream-9") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-stream {
  .mobile-stream img {
    width: 100%;
    height: 100%;
  }
  .img-List {
    > div {
      background: #f0f0f0;
      position: absolute;
      left: 0;
      top: 0;
      @apply rounded-[10px] max-2xl:rounded-[8px] max-xl:rounded-[7px] max-lg:rounded-[5px];
      // 定义宽度、高度、位置（X 和 Y）的数组
    }

    $streamWidth: 412px 709px 584px 412px 412px 584px 709px 412px 581px 506px
      584px 382px 581px 581px;
    $streamHeight: 234px 403px 403px 563px 563px 403px 403px 250px 218px 403px
      403px 167px 167px 218px;
    $streamX: -133px 302px 1034px 1641px -133px 302px 909px 1641px -99px 505px
      1034px 1641px -99px 1641px;
    $streamY: 0px 0px 0px 0px 266px 428px 426px 579px 854px 854px 854px 854px
      1090px 1039px;
    $index: 1 2 3 4 5 6 7 8 9 10 11 12 13 14;

    @each $i in $index {
      $width: nth($streamWidth, $i); // 获取对应的高度
      $height: nth($streamHeight, $i); // 获取对应的高度
      $x: nth($streamX, $i); // 获取对应的 X 位置
      $y: nth($streamY, $i); // 获取对应的 Y 位置

      .child-#{$i} {
        // 为每个子元素创建一个类，如 .child-1, .child-2, 等
        width: $width;
        height: $height;
        position: absolute;
        left: $x;
        top: $y;
      }
    }

    $streamWidth2: 309px 532px 438px 309px 309px 438px 532px 309px 436px 380px
      438px 287px 436px 436px;
    $streamHeight2: 176px 302px 302px 422px 422px 302px 302px 188px 164px 302px
      302px 125px 125px 164px;
    $streamX2: -100px 227px 776px 1231px -100px 227px 682px 1231px -74px 379px
      776px 1231px -74px 1231px;
    $streamY2: 0px 0px 0px 0px 200px 321px 321px 434px 641px 641px 641px 641px
      818px 778px;

    @media not all and (min-width: 1536px) {
      @each $i in $index {
        $width: nth($streamWidth2, $i); // 获取对应的高度
        $height: nth($streamHeight2, $i); // 获取对应的高度
        $x: nth($streamX2, $i); // 获取对应的 X 位置
        $y: nth($streamY2, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }

    $streamWidth3: 275px 473px 389px 275px 275px 389px 473px 275px 387px 337px
      389px 255px 387px 387px;
    $streamHeight3: 156px 269px 269px 375px 375px 269px 269px 167px 145px 269px
      269px 111px 111px 145px;
    $streamX3: -89px 201px 689px 1094px -89px 201px 606px 1094px -66px 337px
      689px 1094px -66px 1094px;
    $streamY3: 0px 0px 0px 0px 177px 286px 286px 386px 569px 569px 569px 569px
      727px 691px;

    @media not all and (min-width: 1280px) {
      @each $i in $index {
        $width: nth($streamWidth3, $i); // 获取对应的高度
        $height: nth($streamHeight3, $i); // 获取对应的高度
        $x: nth($streamX3, $i); // 获取对应的 X 位置
        $y: nth($streamY3, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }

    $streamWidth4: 220px 378px 311px 220px 220px 311px 378px 220px 310px 270px
      311px 204px 310px 310px;
    $streamHeight4: 125px 215px 215px 300px 300px 215px 215px 133px 116px 215px
      215px 89px 89px 116px;
    $streamX4: -71px 161px 551px 875px -71px 161px 485px 875px -53px 269px 551px
      875px -53px 875px;
    $streamY4: 0px 0px 0px 0px 142px 228px 228px 309px 456px 456px 456px 456px
      582px 553px;

    @media not all and (min-width: 1024px) {
      @each $i in $index {
        $width: nth($streamWidth4, $i); // 获取对应的高度
        $height: nth($streamHeight4, $i); // 获取对应的高度
        $x: nth($streamX4, $i); // 获取对应的 X 位置
        $y: nth($streamY4, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }
  }

  .img-List-mobile {
    flex-direction: column;
    gap: 12px;

    img {
      width: 100%;
    }

    > div {
      width: 100%;
      background: #f0f0f0;
      // height: 218px;
    }
  }

  .img-List-2 {
    position: relative;
    @apply mt-[68px] h-[652px] max-2xl:h-[490px] max-xl:h-[434px] max-lg:h-[347px] max-2xl:mt-[54px];

    > div {
      background: #f0f0f0;
      @apply rounded-[10px] max-2xl:rounded-[8px] max-xl:rounded-[7px] max-lg:rounded-[5px];
    }
    $streamWidth-1: 389px 565px 391px 567px 389px 565px 551px 407px 551px;
    $streamHeight-1: 248px 389px 248px 248px 389px 248px 267px 389px 108px;
    $streamX-1: -17px 387px 965px 1371px -17px 387px 965px 1531px 965px;
    $streamY-1: 0px 0px 0px 0px 263px 404px 263px 263px 544px;
    $index-1: 1 2 3 4 5 6 7 8 9;

    @each $i in $index-1 {
      $width: nth($streamWidth-1, $i); // 获取对应的高度
      $height: nth($streamHeight-1, $i); // 获取对应的高度
      $x: nth($streamX-1, $i); // 获取对应的 X 位置
      $y: nth($streamY-1, $i); // 获取对应的 Y 位置

      .child-#{$i} {
        // 为每个子元素创建一个类，如 .child-1, .child-2, 等
        width: $width;
        height: $height;
        position: absolute;
        left: $x;
        top: $y;
      }
    }

    $streamWidth-2: 292px 424px 293px 425px 292px 424px 413px 305px 413px;
    $streamHeight-2: 186px 292px 186px 186px 292px 186px 200px 292px 81px;
    $streamX-2: -13px 290px 724px 1028px -13px 290px 724px 1148px 724px;
    $streamY-2: 0px 0px 0px 0px 197px 303px 197px 197px 408px;

    @media not all and (min-width: 1536px) {
      @each $i in $index-1 {
        $width: nth($streamWidth-2, $i); // 获取对应的高度
        $height: nth($streamHeight-2, $i); // 获取对应的高度
        $x: nth($streamX-2, $i); // 获取对应的 X 位置
        $y: nth($streamY-2, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }

    $streamWidth-3: 259px 377px 261px 378px 259px 377px 367px 271px 367px;
    $streamHeight-3: 165px 259px 165px 165px 259px 165px 178px 259px 72px;
    $streamX-3: -11px 258px 643px 914px -11px 258px 643px 1021px 643px;
    $streamY-3: 0px 0px 0px 0px 175px 269px 175px 175px 362px;

    @media not all and (min-width: 1280px) {
      @each $i in $index-1 {
        $width: nth($streamWidth-3, $i); // 获取对应的高度
        $height: nth($streamHeight-3, $i); // 获取对应的高度
        $x: nth($streamX-3, $i); // 获取对应的 X 位置
        $y: nth($streamY-3, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }

    $streamWidth-4: 207px 301px 209px 302px 207px 301px 294px 217px 294px;
    $streamHeight-4: 132px 207px 132px 132px 207px 132px 142px 207px 58px;
    $streamX-4: -9px 206px 515px 731px -9px 206px 515px 817px 515px;
    $streamY-4: 0px 0px 0px 0px 140px 215px 140px 140px 290px;

    @media not all and (min-width: 1024px) {
      @each $i in $index-1 {
        $width: nth($streamWidth-4, $i); // 获取对应的高度
        $height: nth($streamHeight-4, $i); // 获取对应的高度
        $x: nth($streamX-4, $i); // 获取对应的 X 位置
        $y: nth($streamY-4, $i); // 获取对应的 Y 位置

        .child-#{$i} {
          // 为每个子元素创建一个类，如 .child-1, .child-2, 等
          width: $width;
          height: $height;
          position: absolute;
          left: $x;
          top: $y;
        }
      }
    }
  }
}
</style>
