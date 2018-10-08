<template>
  <div class="banner-container">
    <div v-swiper:mySwiper="swiperOption" :style="{zIndex: 99}">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-if="items.length > 0" v-for="(banner, index) in items">
          <router-link v-if="banner.liveLink" :to="{name:'Live',params:{roomId:banner.roomId}}">
            <img :src="imageUrl + banner.imageUrl" class="banner-img">
            <p class="title">{{banner.title}}</p>
            <p class="sub-title">{{banner.secondTitle}}</p>
            <div class="banner-linear"></div>
          </router-link>
          <template v-else>
            <router-link v-if="!banner.httpLink" :to="{name:'Play',params:{videoBaseId:banner.videoBaseId}}" >
              <img :src="imageUrl + banner.imageUrl" class="banner-img">
              <p class="title">{{banner.title}}</p>
              <p class="sub-title">{{banner.secondTitle}}</p>
              <div class="banner-linear"></div>
            </router-link>
            <a v-if="banner.httpLink" :href="banner.schemeUrl">
              <img :src="imageUrl + banner.imageUrl" class="banner-img">
              <p class="title">{{banner.title}}</p>
              <p class="sub-title">{{banner.secondTitle}}</p>
              <div class="banner-linear"></div>
            </a>
          </template>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets" :style="{zIndex: 99,bottom: .06 + 'rem'}"></div>
    </div>
  </div>
</template>
<script>
import { imageUrl } from '../../util/index';
export default {
    name: 'e-banner',
    props: ['items', 'videoBaseId', 'linkSrc'],
  // props: ['banner'],
    data() {
        return {
            swiperOption: {
                autoplay: 2000,
                direction: 'horizontal',
                initialSlide: 1,
                loop: true,
                pagination: '.swiper-pagination',
                autoplayDisableOnInteraction: false,
            },
            imageUrl: imageUrl
        };
    }
};
</script>
<style>

.banner-container {
  overflow: hidden;
  width: 3.75rem; /* 3.65rem */
  height: 1.7rem; /* margin-left: .05rem; */
  position: relative;
}

.banner-linear {
  position: absolute;
  width: 100%;
  height: .8rem;
  bottom: 0;
  background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .6) 100%);
  z-index: 10;
}

.title {
  position: absolute;
  left: .09rem;
  bottom: .25rem;
  color: #FFF;
  font-size: .17rem;
  z-index: 11;
}

.sub-title {
  position: absolute;
  left: .09rem;
  bottom: .12rem;
  color: rgba(255, 255, 255, .8);
  font-size: .1rem;
  z-index: 11;
}

.banner-img {
  width: 100%;
  height: 1.7rem;
  display: block;
}

.swiper-pagination .swiper-pagination-bullets {
  bottom: .07rem;
}
</style>
