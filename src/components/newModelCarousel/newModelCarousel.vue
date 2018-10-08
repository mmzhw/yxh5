<template>
  <router-link v-if="singleCarouselVideo.videoId" :to="{name: 'Play', params: { videoBaseId: singleCarouselVideo.videoId}}"
    :class="{ 'single-large-video': mode === 'large', 'single-horizontal-video': mode === 'horizontal',
    'single-vertical-video': mode === 'vertical' }"
  >
    <div class="singleCarouselVideo single-video-img-wrap">
      <img class="single-video-img" :src="imageUrl + singleCarouselVideo.imageUrl">
      <div class="single-video-info">
        <p v-if="singleCarouselVideo.name" class="single-video-name" :class="{ 'only-name': !singleCarouselVideo.subName }">{{ singleCarouselVideo.name }}</p>
        <p v-if="singleCarouselVideo.subName" class="single-video-subName">{{ singleCarouselVideo.subName }}</p>
      </div>
    </div>
  </router-link>
  <a v-else :href="singleCarouselVideo.url" >
    <div class="singleCarouselVideo single-video-img-wrap">
      <img class="single-video-img" :src="imageUrl + singleCarouselVideo.imageUrl">
      <div class="single-video-info">
        <p v-if="singleCarouselVideo.name" class="single-video-name" :class="{ 'only-name': !singleCarouselVideo.subName }">{{ singleCarouselVideo.name }}</p>
        <p v-if="singleCarouselVideo.subName" class="single-video-subName">{{ singleCarouselVideo.subName }}</p>
      </div>
    </div>
  </a>
</template>
<script>
  import { imageUrl } from '../../util/index.js';
  export default {
      name: 'carousel-video',
      props: ['singleCarouselVideo', 'mode'],
      // props: {
      //   // 检测类型
      //     mode: String,
      //     // 检测类型 + 其他验证
      //     singleCarouselVideo: {
      //         // type: Object,
      //         default: {},
      //         required: true
      //     }
      // },
      data () {
          return {
              imageUrl: ''
          };
      },
      created() {
          this.imageUrl = imageUrl;
      }
  };
</script>
<style scoped>
  .single-video-img-wrap {
    display: inline-block;
    text-align: center;
    position: relative;
    width: 1.76rem;
    .single-video-img {
      width: 1.76rem;
      height: 1.01rem;
      border-radius: .04rem;
    }
    .single-video-info {
      box-sizing: border-box;
      width: 1.76rem;
      position: absolute;
      top: .72rem;
      background-image: url("../../assets/indexChannel/font-bg.png");
      background-size: 100%;
      border-radius: 0 0 .04rem .04rem;
      z-index: 22;/* background-image: linear-gradient(rgba(233, 233, 233, .8) 0%, rgba(60, 60, 60, 1) 100%); */
      .single-video-name {
        width: 1.66rem;
        padding: 0 .05rem;
        color: #FFF;
        font-size: .12rem;
        line-height: .14rem;
        box-sizing: border-box;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
        &.only-name {
          margin-top: .13rem;
          margin-bottom: .01rem;
        }
      }
      .single-video-subName {
        margin-bottom: .03rem;
        width: 1.66rem;
        padding: 0 .05rem;
        color: #FFF;
        font-size: .1rem;
        line-height: .14rem;
        box-sizing: border-box;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
      }
    }
  }
</style>
