<script lang="ts" setup>
import contact1 from "@/assets/images/lianxi-1.png";
import contact2 from "@/assets/images/lianxi-2.png";
import contact3 from "@/assets/images/lianxi-3.png";
import contact4 from "@/assets/images/lianxi-4.png";
const { t } = useI18n();
const registrationImgUrl = (index: number) => {
  return new URL(
    `/assets/images/registration-${index + 1}.png`,
    import.meta.url
  ).pathname;
};
const speakersImgUrl = (index: number) => {
  return new URL(`/assets/images/speaker-${index + 1}.png`, import.meta.url)
    .pathname;
};
const partnersImgUrl = (index: number) => {
  // const svgFile = [1, 5]
  // if (svgFile.includes(index + 1)) return new URL(`/assets/images/partners-${index + 1}.svg`, import.meta.url).pathname
  return new URL(`/assets/images/partners-${index + 1}.png`, import.meta.url)
    .pathname;
};

const email = ref();
const store = useAppStore();
watch(
  () => store.clickNum,
  () => {
    if (store.selectIndex == "-1") {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      return;
    }
    let scrollViews = document.querySelectorAll(".scrollViews");
    const selectIndex =
      +store.selectIndex == 2
        ? 1
        : +store.selectIndex == 1
        ? 2
        : +store.selectIndex;
    const top = (scrollViews[selectIndex] as HTMLElement).offsetTop;
    window.scroll({
      top: top,
      behavior: "smooth",
    });
  }
);
//'Discord', 'Twitter', 'YouTube', 'Telegram'
const contact = ref([
  { name: "Discord", url: "", img: contact1 },
  { name: "Twitter", url: "https://x.com/veloza_award", img: contact2 },
  { name: "YouTube", url: "", img: contact3 },
  { name: "Telegram", url: "https://t.me/veloza_award", img: contact4 },
]);
</script>
<template>
  <NuxtLayout name="default">
    <div class="home">
      <div class="relative">
        <div
          class="home-intro z-[99] scrollViews relative flex flex-col justify-center max-md:justify-start max-md:pt-[64px] box-border gap-[10px] max-2xl:gap-[8px] max-xl:gap-[7px] max-lg:gap-[5px] max-md:gap-[27px]"
        >
          <div
            class="text-[61px] max-2xl:text-[47px] max-xl:text-[39px] max-lg:text-[31px] max-md:text-[30px] font-black"
          >
            {{ t("intro-1") }}
          </div>
          <div
            class="text-[135px] max-2xl:text-[105px] max-xl:text-[87px] max-lg:text-[70px] max-md:text-[60px] font-bold"
          >
            2025
          </div>
          <div
            class="text-[41px] max-2xl:text-[32px] max-xl:text-[27px] max-lg:text-[21px] max-md:text-[24px]"
          >
            {{ t("intro-2") }}
          </div>
        </div>
        <div class="z-[10]">
          <img
            src="@/assets/images/pexels-jibarofoto-2774556@2x.png"
            class="w-full h-full left-0 top-0 absolute z-[1] grayscale max-md:hidden"
            alt=""
          />
          <img
            src="@/assets/images/pexels-jibarofoto-black.png"
            class="w-full h-full left-0 top-0 absolute z-[2] max-md:hidden"
            alt=""
          />
          <img
            src="@/assets/images/pexels-jibarofoto-mobile.png"
            class="w-full h-full left-0 top-0 absolute z-[1] grayscale hidden max-md:block"
            alt=""
          />
          <img
            src="@/assets/images/pexels-jibarofoto-black-mobile.png"
            class="w-full h-full left-0 top-0 absolute z-[20] hidden max-md:block"
            alt=""
          />
        </div>
        <video
          class="video-background z-[20] max-md:hidden"
          autoplay
          loop
          muted
          playsinline
        >
          <source src="@/assets/videos/网页视频v2.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="home-intro-content text-[#2f2f2f] flex-center flex-col">
        <div
          class="text-[72px] max-2xl:text-[56px] max-xl:text-[47px] max-lg:text-[37px] max-md:text-[30px] font-black"
        >
          {{ t("intro-3") }}
        </div>
        <div
          class="mt-[47px] max-2xl:mt-[37px] max-xl:mt-[31xp] max-lg:mt-[25px] max-md:mt-[37px] text-[41px] max-2xl:text-[32px] max-xl:text-[27px] max-lg:text-[21px] max-md:text-[20px]"
        >
          {{ t("intro-4") }}
        </div>
        <div
          class="text-[30px] mt-[24px] max-2xl:text-[24px] max-2xl:mt-[19px] max-xl:text-[20px] max-xl:mt-[16px] max-lg:text-[16px] max-lg:mt-[13px] max-md:text-[16px] max-md:px-[19px] max-md:mt-[16px]"
        >
          {{ t("intro-9") }}
        </div>
        <div
          class="flex mt-[28px] max-2xl:mt-[22px] max-xl:mt-[19px] max-lg:mt-[15xp] max-md:mt-[47px] gap-[20px] max-2xl:gap-[15px] max-xl:gap-[13px] max-lg:gap-[10px] max-md:gap-[14px] max-md:w-full"
        >
          <button>{{ t("intro-5") }}</button>
          <button>{{ t("intro-6") }}</button>
        </div>
        <div
          class="mt-[69px] max-2xl:mt-[54px] max-xl:mt-[45px] max-lg:mt-[36px] max-md:mt-[73px]"
        >
          <img
            class="h-auto w-[329px] max-2xl:w-[255px] max-xl:w-[213px] max-lg:w-[170px] max-md:w-[243.29px]"
            src="@/assets/images/logo.png"
            alt=""
          />
        </div>
        <div
          class="mt-[50px] max-2xl:mt-[38px] max-xl:mt-[32px] max-lg:mt-[26px] max-md:mt-[37px] text-[66px] max-2xl:text-[51px] max-xl:text-[43px] max-lg:text-[34px] max-md:text-[30px] font-black"
        >
          {{ t("intro-7") }}
        </div>
        <div
          class="px-[311px] max-2xl:px-[242px] max-xl:px-[201px] max-lg:px-[161px] mt-[38px] max-2xl:mt-[30px] max-xl:mt-[25px] max-lg:mt-[20px] max-md:mt-[49px] text-[21px] max-2xl:text-[16px] max-xl:text-[13px] max-lg:text-[11px] max-md:text-[14px]"
        >
          {{ t("intro-8") }}
        </div>
      </div>
      <div class="home-number">
        <div>
          <div>10,000+</div>
          <div>{{ t("number-1") }}</div>
        </div>
        <div>
          <div>5,000+</div>
          <div>{{ t("number-2") }}</div>
        </div>
        <div>
          <div>300+</div>
          <div>{{ t("number-3") }}</div>
        </div>
        <div>
          <div>100+</div>
          <div>{{ t("number-4") }}</div>
        </div>
      </div>
      <div class="home-registration scrollViews max-md:!bg-none">
        <div
          class="text-[#313341] font-bold text-[70px] max-2xl:text-[56px] max-xl:text-[47px] max-lg:text-[37px] max-md:text-[30px] max-md:px-[19px] text-center"
        >
          {{ t(`registration-1`) }}
        </div>
        <div class="home-registration-line-list">
          <div v-for="(_, index) in 3" :key="_" class="home-registration-line">
            <div
              class="relative bg-[#cf0708] flex w-full justify-end items-center flex-col text-center relative h-[512px] max-2xl:h-[410px] max-xl:h-[341px] max-lg:h-[273px] max-md:h-[478px]"
            >
              <div
                :class="index > 0 ? 'text-[#F0EDDD]' : 'text-[#25241E]'"
                class="z-[2] font-black text-[30px] max-2xl:text-[24px] max-xl:text-[20px] max-lg:text-[16px] max-md:text-[30px]"
              >
                {{ t(`registration-${2 + index * 4}`) }}
              </div>
              <div
                :class="index > 0 ? 'text-[#F0EDDD]' : 'text-[#25241E]'"
                class="z-[2] text-[#25241E] text-[20px] mt-[17px] max-2xl:text-[16px] max-2xl:mt-[14px] max-xl:text-[13px] max-xl:mt-[11px] max-lg:text-[11px] max-lg:mt-[9px] max-md:text-[20px] max-md:mt-[11px]"
              >
                {{ t(`registration-${3 + index * 4}`) }}
              </div>
              <div class="max-md:px-[24px] z-[2] w-full">
                <button
                  class="hover:bg-[#be0a0b] hover:text-[#fff] !bg-[#be0a0b] font-bold text-[#fff] w-full leading-[74px] mt-[51px] text-[20px] rounded-[10px] max-2xl:w-[295px] max-2xl:leading-[59px] max-2xl:mt-[41px] max-2xl:text-[16px] max-2xl:rounded-[8px] max-xl:w-[246px] max-xl:leading-[49px] max-xl:mt-[34px] max-xl:text-[13px] max-xl:rounded-[7px] max-lg:w-[197px] max-lg:leading-[39px] max-lg:mt-[27px] max-lg:text-[11px] max-lg:rounded-[5px] max-md:w-full max-md:leading-[69px] max-md:mt-[46px] max-md:text-[18px] max-md:rounded-[10px]"
                >
                  {{ t(`registration`) }}
                </button>
              </div>

              <img
                class="absolute mix-blend-hard-light z-1 w-full h-full absolute left-0 top-0"
                :src="registrationImgUrl(index)"
                alt=""
              />
            </div>
            <div
              class="text-[#2C2D34] font-bold text-[30px] mt-[37px] h-[74px] max-2xl:text-[24px] max-2xl:mt-[30px] max-2xl:h-[59px] max-xl:text-[20px] max-xl:mt-[25px] max-xl:h-[49px] max-lg:text-[16px] max-lg:mt-[20px] max-lg:h-[39px] max-md:text-[30px] max-md:mt-[43px] max-md:h-auto max-md:min-h-[74px]"
            >
              {{ t(`registration-${4 + index * 4}`) }}
            </div>
            <div
              class="text-[#2C2D34] mt-[29px] text-[20px] max-2xl:mt-[23px] max-2xl:text-[16px] max-xl:mt-[19px] max-xl:text-[13px] max-lg:mt-[15px] max-lg:text-[11px] max-md:mt-[15px] max-md:text-[20px]"
            >
              {{ t(`registration-${5 + index * 4}`) }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-[#be0a0b] text-[#F0EDDD] relative flex items-center flex-col text-center h-[651px] pt-[73px] max-2xl:h-[521px] max-2xl:pt-[58px] max-xl:h-[434px] max-xl:pt-[49px] max-lg:h-[347px] max-lg:pt-[39px] max-md:h-[651px] max-md:pt-[91px]"
      >
        <div
          class="font-bold text-[30px] mb-[51px] max-2xl:text-[24px] max-2xl:mb-[41px] max-xl:text-[20px] max-xl:mb-[34px] max-lg:text-[16px] max-lg:mb-[27px] max-md:text-[30px] max-md:mb-[21px]"
        >
          {{ t("home-1") }}
        </div>
        <div
          class="text-[20px] w-[1080px] leading-[40px] max-2xl:text-[16px] max-2xl:w-[864px] max-2xl:leading-[32px] max-xl:text-[13px] max-xl:w-[720px] max-xl:leading-[27px] max-lg:text-[11px] max-lg:w-[576px] max-lg:leading-[21px] max-md:text-[20px] max-md:w-full max-md:px-[19px] max-md:leading-[35px]"
        >
          {{ t("home-2") }}
        </div>
        <img
          class="absolute left-1/2 -translate-x-1/2 top-[270px] w-[1316px] max-2xl:top-[206px] max-2xl:w-[1053px] max-xl:top-[180px] max-xl:w-[877px] max-lg:top-[144px] max-lg:w-[702px] max-md:hidden"
          src="@/assets/images/pexels-hocuongx.png"
          alt=""
        />
        <img
          class="absolute left-1/2 -translate-x-1/2 hidden max-md:-bottom-[67px] max-md:w-full max-md:px-[19px] max-md:block"
          src="@/assets/images/pexels-hocuongx-mobile.png"
          alt=""
        />
      </div>
      <HomeStream />
      <!-- our speakers
      <div class="speakers w-full overflow-hidden">
        <div class="speakers-text">{{ t("speakers-1") }}</div>

      </div> -->

      <div class="awards overflow-hidden">
        <div class="awards-text">
          {{ t("speakers-1") }}
        </div>
        <div
          class="flex flex-wrap justify-center overflow-hidden w-full mt-[115px] max-2xl:mt-[96px] max-xl:mt-[57px] max-lg:mt-[43px] max-md:mt-[46px]"
        >
          <div
            v-for="(_, index) in 18"
            class="speakers relative w-[calc(100%/6)] h-[calc(100vw/6)] max-2xl:w-[calc(100%/6)] max-2xl:h-[calc(100vw/6)] max-xl:w-[calc(100%/6)] max-xl:h-[calc(100vw/6)] max-lg:w-[calc(100%/6)] max-lg:h-[calc(100vw/6)] max-md:w-[calc(100%/3)] max-md:h-[calc(100vw/3)]"
            :key="index"
          >
            <img
              :src="speakersImgUrl(index)"
              class="absolute top-0 mix-blend-hard-light w-full h-full"
              alt=""
            />
          </div>
        </div>

        <div
          class="awards-text mt-[115px] max-2xl:mt-[96px] max-xl:mt-[57px] max-lg:mt-[43px] max-md:mt-[46px]"
        >
          {{ t("awards-1") }}
        </div>
        <div class="flex awards-imgs-1">
          <div class="awards-img">
            <img src="@/assets/images/awars-1.png" alt="" />
            <div>{{ t("awards-5") }}</div>
          </div>
          <div class="awards-img">
            <img src="@/assets/images/awars-2.png" alt="" />
            <div>{{ t("awards-6") }}</div>
          </div>
          <div class="awards-img">
            <img class="awards-img" src="@/assets/images/awars-3.png" alt="" />
            <div>{{ t("awards-7") }}</div>
          </div>
        </div>
        <div
          class="awards-text w-[782px] max-2xl:w-[626px] max-xl:w-[521px] max-lg:w-[417px] mt-[79px] max-2xl:mt-[63px] max-xl:mt-[53px] max-lg:mt-[42px] max-md:mt-[57px] max-md:px-[19px]"
        >
          {{ t("awards-2") }}
        </div>
        <div class="flex awards-imgs-2">
          <div>
            <img class="awards-img" src="@/assets/images/relive-1.png" alt="" />
            <img src="@/assets/images/player.png" alt="" />
          </div>
          <div>
            <img class="awards-img" src="@/assets/images/relive-2.png" alt="" />
            <img src="@/assets/images/player.png" alt="" />
          </div>
        </div>

        <div
          class="bg-[#cf0708] w-full flex-center flex-col mt-[102px] max-2xl:mt-[67px]"
        >
          <div
            class="awards-text !text-[#fff] mt-[115px] max-2xl:mt-[96px] max-xl:mt-[57px] max-lg:mt-[43px] max-md:mt-[46px]"
          >
            {{ t("awards-3") }}
          </div>
          <div class="partners">
            <button v-for="(_, index) in 14" :key="index">
              <img :src="partnersImgUrl(index)" alt="" />
              <!-- <img v-else src="@/assets/images/partners-5.svg" /> -->
            </button>
          </div>
        </div>
        <div
          class="awards-text scrollViews mt-[91px] max-2xl:mt-[73px] max-xl:mt-[61px] max-lg:mt-[49px] max-md:mt-[61px]"
        >
          {{ t("awards-4") }}
        </div>
        <div class="contact">
          <div v-for="(item, index) in contact" :key="item.name">
            <div>
              <img :src="item.img" alt="" />
              <div>{{ item.name }}</div>
            </div>
            <div>
              <div>{{ t(`awards-${8 + index}`) }}</div>
              <div class="jiantou">
                <NuxtLink :to="item.url" target="_blank">
                  <img src="@/assets/images/jiantou.png" alt="" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="connection">
        <div class="">{{ t("awards-12") }}</div>
        <div>
          <input v-model:="email" type="text" :placeholder="t('awards-14')" />
          <button>{{ t("awards-13") }}</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<style lang="scss" scoped>
.home {
  .home-intro {
    @apply h-[770px] max-2xl:h-[598px] max-xl:h-[498px] max-lg:h-[398px] max-md:h-[782px] w-full px-[311px] max-2xl:px-[242px] max-xl:px-[201px] max-lg:px-[161px] max-md:px-[19px] max-md:justify-start;

    > div {
      z-index: 10;
    }
  }

  .home-intro-content {
    background: url("@/assets/images/intro-back.png") repeat center center;
    text-align: center;
    @apply pt-[102px] pb-[51px] max-2xl:pt-[79px] max-2xl:pb-[39px] max-xl:pt-[66px] max-xl:pb-[33px] max-lg:pt-[53px] max-lg:pb-[26px] max-md:pt-[134px] max-md:pb-[114px];

    button {
      background: #be0a0b;
      color: white;
      text-align: center;
      @apply font-black w-[251px] leading-[77px] max-2xl:w-[194px] max-2xl:leading-[60px] max-xl:w-[162px] max-xl:leading-[50px] max-lg:w-[130px] max-lg:leading-[40px] max-md:flex-1 max-md:w-full max-md:leading-[58px] text-[21px] max-2xl:text-[16px] max-xl:text-[13px] max-lg:text-[11px] max-md:text-[14px];
    }
    button:nth-child(1) {
      @apply max-md:bg-[#be0a0b] max-md:text-[#B0B0B0];
    }
    button:nth-child(2) {
      @apply max-md:bg-[#be0a0b] max-md:text-[#B0B0B0];
    }
    > div {
      @apply max-md:px-[19px];
    }
  }

  .home-number {
    background: url("@/assets/images/intro-back-2.png") repeat center center;
    background-color: #f7f7f6;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    background-color: #be0a0b;
    @apply max-md:flex-col py-[97px] px-[386px] max-2xl:px-[299px] max-2xl:py-[75px] max-xl:px-[249px] max-xl:py-[63px] max-lg:px-[199px] max-lg:py-[50px] max-md:px-[91px] max-md:py-[80px] max-md:gap-[69px];

    > div {
      @apply flex flex-col gap-[24px] max-2xl:gap-[18px] max-xl:gap-[15px] max-lg:gap-[12px] max-md:gap-[23px];

      > div {
        &:first-child {
          color: #ffffff;
          @apply font-bold text-[62px] max-2xl:text-[48px] max-xl:text-[40px] max-lg:text-[32px] max-md:text-[60px];
        }

        &:last-child {
          color: #f0eddd;
          @apply text-[21px] max-2xl:text-[16px] max-xl:text-[13px] max-lg:text-[11px] max-md:text-[20px];
        }
      }
    }
  }

  .home-registration {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("@/assets/images/registration-back.png") repeat;
    @apply pt-[80px] pb-[95px] max-2xl:pt-[64px] max-2xl:pb-[76px] max-xl:pt-[53px] max-xl:pb-[63px] max-lg:pt-[43px] max-lg:pb-[51px] max-md:pt-[45px] max-md:pb-[72px];

    .home-registration-line-list {
      display: flex;
      justify-content: center;
      @apply mt-[73px] gap-[28px] max-2xl:mt-[58px] max-2xl:gap-[22px] max-xl:mt-[49px] max-xl:gap-[19px] max-lg:mt-[39px] max-lg:gap-[15px] max-md:mt-[42px] max-md:gap-[41px] max-md:flex-col;

      .home-registration-line {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        @apply w-[420px] max-2xl:w-[336px] max-xl:w-[280px] max-lg:w-[224px] max-md:w-full max-md:px-[19px];

        > div:first-child {
          @apply pb-[74px] max-2xl:pb-[26px] max-xl:pb-[22px] max-lg:pb-[18px] max-md:pb-[31px];

          > div {
            @apply px-[26px] max-2xl:px-[14px] max-xl:px-[11px] max-lg:px-[9px] max-md:px-[16px];
          }
        }
      }
    }
  }

  .awards {
    display: flex;
    flex-direction: column;
    text-align: center;
    background: url("@/assets/images/registration-back.png") repeat center
      center;
    background-color: #f7f7f6;
    // background: 50%;
    @apply items-center justify-center pt-[125px] pb-[93px] max-2xl:pt-[100px] max-2xl:pb-[74px] max-xl:pt-[83px] max-xl:pb-[62px] max-lg:pt-[67px] max-lg:pb-[50px] max-md:pt-[61px] max-md:pb-[85px];

    .awards-text {
      @apply text-[#313341] font-black text-[70px] max-2xl:text-[56px] max-xl:text-[47px] max-lg:text-[37px] max-md:text-[30px];
    }

    .speakers {
      background-image: url("@/assets/images/speaker-back.png");
      background-size: cover;
    }

    .awards-img {
      flex: 1;
      width: 100%;
      height: auto;
      filter: grayscale(1);
    }

    .awards-imgs-1 {
      @apply mt-[79px] gap-[16px] max-2xl:mt-[63px] max-2xl:gap-[13px] max-xl:mt-[53px] max-xl:gap-[11px] max-lg:mt-[42px] max-lg:gap-[9px] max-md:mt-[48px] max-md:gap-[21px] max-md:flex-col max-md:px-[19px];

      img {
        @apply w-[428px] max-2xl:w-[342px] max-xl:w-[285px] max-lg:w-[228px] max-md:w-full;
      }

      .awards-img {
        position: relative;

        div {
          position: absolute;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          @apply text-[#F0EDDD] font-bold px-[55px] text-[29px] leading-[40px] bottom-[72px] min-h-[74px] max-2xl:px-[44px] max-2xl:text-[23px] max-2xl:leading-[32px] max-2xl:bottom-[58px] max-2xl:min-h-[59px] max-xl:px-[37px] max-xl:text-[19px] max-xl:leading-[27px] max-xl:bottom-[48px] max-xl:min-h-[49px] max-lg:px-[29px] max-lg:text-[15px] max-lg:leading-[21px] max-lg:bottom-[38px] max-lg:min-h-[39px] max-md:px-[50px] max-md:text-[29px] max-md:leading-[40px] max-md:bottom-[59px] max-md:min-h-[74px];
        }
      }
    }

    .awards-imgs-2 {
      @apply mt-[37px] gap-[12px] max-2xl:mt-[30px] max-2xl:gap-[10px] max-xl:mt-[25px] max-xl:gap-[8px] max-lg:mt-[20px] max-lg:gap-[6px] max-md:mt-[36px] max-md:gap-[15px] max-md:flex-col max-md:px-[19px];

      > div {
        cursor: pointer;
      }

      img {
        @apply w-[652px] max-2xl:w-[522px] max-xl:w-[435px] max-lg:w-[348px] max-md:w-full;
      }

      > div {
        position: relative;

        > img:last-child {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          @apply max-lg:w-[24px] max-xl:w-[30px] max-2xl:w-[36px] w-[45px] max-md:w-[24px];
        }
      }
    }

    .partners {
      display: grid;

      @apply grid-cols-7 w-[1316px] mt-[107px] gap-y-[36px] mb-[156px] max-2xl:w-[1053px] max-2xl:mt-[86px] max-2xl:gap-y-[29px] max-2xl:mb-[125px] max-xl:w-[877px] max-xl:mt-[71px] max-xl:gap-y-[24px] max-xl:mb-[105px] max-lg:w-[702px] max-lg:mt-[57px] max-lg:gap-y-[19px] max-lg:mb-[85px] max-md:w-full max-md:px-[36px] max-md:mt-[57px] max-md:gap-y-[27px] max-md:gap-x-[11px] max-md:mb-[147px];

      @media (max-width: 767px) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      button {
        background-color: #cf0708;
        @apply flex justify-center border-solid border-white border-[1px] items-center w-[154px] h-[56px] py-[9px] rounded-[10px] px-[19px] max-2xl:w-[123px] max-2xl:h-[45px] max-2xl:py-[7px] max-2xl:rounded-[8px] max-2xl:px-[14px] max-xl:w-[103px] max-xl:h-[37px] max-xl:py-[6px] max-xl:rounded-[7px] max-xl:px-[12px] max-lg:w-[82px] max-lg:h-[30px] max-lg:py-[4px] max-lg:rounded-[5px] max-lg:px-[10px] max-md:w-[154px] max-md:h-[41px] max-md:py-[5px] max-md:rounded-[10px] max-md:px-[13px] max-md:m-[5px];

        img {
          @apply max-h-full;
        }
      }
    }
  }

  .contact {
    display: flex;
    justify-content: center;
    @apply mt-[72px] gap-[40px] max-2xl:mt-[58px] max-2xl:gap-[33px] max-xl:mt-[48px] max-xl:gap-[27px] max-lg:mt-[38px] max-lg:gap-[22px] max-md:mt-[34px] max-md:gap-[46px] max-md:flex-col max-md:px-[20%] max-md:w-full;

    > div {
      background-color: white;
      color: #2c2d34;
      @apply w-[220px] pl-[34px] pr-[22px] pt-[36px] pb-[29px] rounded-[8px] max-2xl:w-[176px] max-2xl:pl-[27px] max-2xl:pr-[18px] max-2xl:pt-[29px] max-2xl:pb-[18px] max-2xl:rounded-[6px] max-xl:w-[147px] max-xl:pl-[23x] max-xl:pr-[15px] max-xl:pt-[24px] max-xl:pb-[15px] max-xl:rounded-[5px] max-lg:w-[117px] max-lg:pl-[18px] max-lg:pr-[12px] max-lg:pt-[19px] max-lg:pb-[12px] max-lg:rounded-[4px] max-md:w-full max-md:pl-[34px] max-md:pr-[22px] max-md:pt-[36px] max-md:pb-[22px] max-md:rounded-[8px];

      > div {
        display: flex;
        align-items: center;

        @apply text-[16px] max-2xl:text-[13px] max-xl:text-[11px] max-lg:text-[9px] max-md:text-[16px];

        &:first-child {
          font-weight: 700;

          img {
            @apply h-[30px] mr-[24px] max-2xl:h-[22px] max-2xl:mr-[19px] max-xl:h-[17px] max-xl:mr-[16px] max-lg:h-[14px] max-lg:mr-[17px] max-md:h-[25px] max-md:mr-[24px];
          }
        }

        &:last-child {
          justify-content: space-between;
          align-items: center;
          @apply mt-[28px] max-2xl:mt-[22px] max-xl:mt-[19px] max-lg:mt-[15px] max-md:mt-[28px];

          .jiantou {
            border: 1px solid #3a3b40;
            border-radius: 100%;
            cursor: pointer;
            @apply flex justify-center items-center w-[34px] h-[34px] max-2xl:w-[27px] max-2xl:h-[27px] max-xl:w-[23px] max-xl:h-[23px] max-lg:w-[18px] max-lg:h-[18px] max-md:w-[34px] max-md:h-[34px];

            img {
              @apply w-[20px] max-2xl:w-[16px] max-xl:w-[13px] max-lg:w-[11px] max-md:w-[19px];
            }
          }
        }
      }
    }
  }

  .connection {
    @apply flex flex-col justify-center items-center pt-[67px] pb-[96px] max-2xl:pt-[54px] max-2xl:pb-[77px] max-xl:pt-[45px] max-xl:pb-[64px] max-lg:pt-[36px] max-lg:pb-[51px] max-md:pt-[47px] max-md:pb-[74px];

    > div {
      &:first-child {
        color: #313341;
        text-align: center;
        font-weight: 700;
        @apply text-[30px] max-2xl:text-[24px] max-xl:text-[20px] max-lg:text-[16px] max-md:text-[16px] max-md:px-[19px];
      }

      &:last-child {
        font-weight: 700;
        @apply mt-[62px] text-[20px] max-2xl:mt-[50px] max-2xl:text-[16px] max-xl:mt-[41px] max-xl:text-[13px] max-lg:mt-[33px] max-lg:text-[11px] max-md:mt-[46px] max-md:text-[20px] max-md:flex max-md:flex-col max-md:px-[19px] max-md:gap-[28px];

        input {
          border: 2px solid #be0a0b;
          color: #313341;
          @apply h-[91px] w-[736px] mr-[18px] px-[28px] max-2xl:h-[73px] max-2xl:w-[589px] max-2xl:mr-[14px] max-2xl:px-[22px] max-xl:h-[61px] max-xl:w-[491px] max-xl:mr-[12px] max-xl:px-[19px] max-lg:h-[49px] max-lg:w-[393px] max-lg:mr-[10px] max-lg:px-[15px] max-md:w-full max-md:h-[91px] max-md:px-[28px];
        }

        button {
          background: #be0a0b;
          color: #fff;
          @apply w-[234px] leading-[91px] max-2xl:w-[187px] max-2xl:leading-[73px] max-xl:w-[156px] max-xl:leading-[61px] max-lg:w-[125px] max-lg:leading-[49px] max-md:w-full max-md:leading-[91px];
        }

        > * {
          @apply rounded-[10px] max-2xl:rounded-[8px] max-xl:rounded-[7px] max-lg:rounded-[5px] max-md:rounded-[10px];
        }
      }
    }
  }

  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
