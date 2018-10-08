<template>
  <div v-if="singleVideoData" :class="{ 'single-large-video': mode === 'large', 'single-horizontal-video': mode === 'horizontal', 'single-vertical-video': mode === 'vertical' }">
    <router-link v-if="singleVideoData.videoId" :to="{name: 'Play', params: { videoBaseId: singleVideoData.videoId }}" style="display: inline-block; position: relative;">
      <div class="single-video-img-wrap">
        <img class="single-video-img" v-lazy="imageUrl + singleVideoData.imageUrl">
        <p
          v-if="singleVideoData.extMap && singleVideoData.extMap.updateEpisode"
          class="single-video-update"
        >{{ singleVideoData.extMap.updateEpisode }}</p>
      </div>
      <div class="video-sign" v-if="singleVideoData.extMap && singleVideoData.extMap.sign">
        <img v-if="singleVideoData.extMap.sign === '独播'" src="../../assets/common/sign-unique.svg" alt="">
        <img v-if="singleVideoData.extMap.sign === '自制'" src="../../assets/common/sign-homemade.svg" alt="">
      </div>
      <span v-if="singleVideoData.extMap && singleVideoData.extMap.clarity" class="video-clarity">{{ singleVideoData.extMap.clarity }}</span>
      <div class="single-video-info">
        <h3 v-if="singleVideoData.name" class="single-video-name">{{ singleVideoData.name }}</h3>
        <h3 v-if="mode === 'large'" class="single-video-desc">{{ singleVideoData.subName }}</h3>
        <h3 v-if="mode === 'horizontal' && parseInt(layout) === 9" class="single-video-subName">{{ singleVideoData.subName }}</h3>
      </div>
    </router-link>
    <a v-else :href="singleVideoData.url" style="display: inline-block; position: relative;">
      <div class="single-video-img-wrap">
        <img class="single-video-img" v-lazy="imageUrl + singleVideoData.imageUrl">
        <p
          v-if="singleVideoData.extMap && singleVideoData.extMap.updateEpisode"
          class="single-video-update"
        >{{ singleVideoData.extMap.updateEpisode }}</p>
      </div>
      <div class="video-sign" v-if="singleVideoData.extMap && singleVideoData.extMap.sign">
        <img v-if="singleVideoData.extMap.sign === '独播'" src="../../assets/common/sign-unique.svg" alt="">
        <img v-if="singleVideoData.extMap.sign === '自制'" src="../../assets/common/sign-homemade.svg" alt="">
      </div>
      <span v-if="singleVideoData.extMap && singleVideoData.extMap.clarity" class="video-clarity">{{ singleVideoData.extMap.clarity }}</span>
      <div class="single-video-info">
        <h3 v-if="singleVideoData.name" class="single-video-name">{{ singleVideoData.name }}</h3>
        <h3 v-if="mode === 'large'" class="single-video-desc">{{ singleVideoData.subName }}</h3>
        <h3 v-if="mode === 'horizontal' && parseInt(layout) === 9" class="single-video-subName">{{ singleVideoData.subName }}</h3>
      </div>
    </a>
  </div>
</template>
<script>
import { imageUrl } from '../../util/index.js';
export default {
    name: 'single-video',

    props: ['singleVideoData', 'mode', 'layout'],

    data () {
        return {
            imageUrl: '',
      // mode: this.mode, // 'large', // horizontal 横向 vertical 纵向
        };
    },
    created() {
        this.imageUrl = imageUrl;
    },
    mounted () {
    },
  // scale 和 图片之间的对应关系 1-16:9 2-4:3 3-2:3 4-3:2 5-1:1
    computed: {
    // imgUrl () {
    //   let imgObj
    //   if (this.mode === 'large') {
    //     this.singleVideoData.images.forEach(img => {
    //       if (img.scale === 1) {
    //         imgObj = img
    //       }
    //     })
    //     return imageUrl + imgObj.url
    //   } else if (this.mode === 'vertical') {
    //     this.singleVideoData.images.forEach(img => {
    //       if (img.scale === 3) {
    //         imgObj = img
    //       }
    //     })
    //     return imageUrl + imgObj.url
    //   } else if (this.mode === 'horizontal') {
    //     this.singleVideoData.images.forEach(img => {
    //       if (img.scale === 1) {
    //         imgObj = img
    //       }
    //     })
    //     return imageUrl + imgObj.url
    //   }
    // },
        signUrl () {
            if (this.singleVideoData.extMap.sign === '独播') {
                return '../../assets/common/sign-unique.svg';
            } else if (this.singleVideoData.extMap.sign === '自制') {
                return '../../assets/common/sign-homemade.svg';
            } else {
                return '../../assets/common/sign-homemade.svg';
            }
        }
    }
};
</script>

<style scoped>

  .video-sign {
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    & > img {
      width: .37rem;
      height: .37rem;
    }
    .video-sign-text {
      color: #FFF;
      z-index: 100;
      position: absolute;
      right: .01rem;
      top: .08rem;
      transform: rotate(45deg);
      font-size: .1rem;
    }
  }

  .video-clarity {
    position: absolute;
    top: .05rem;
    left: .05rem;
    height: .1rem;
    padding: .03rem .05rem;
    text-align: center;
    line-height: .1rem;
    font-size: .1rem;
    color: #FFF;
    background: rgba(0, 0, 0, .5);
    border-radius: 4px;
  }

  .single-large-video {
    display: inline-block;
    margin-bottom: .12rem;
    .single-video-img-wrap {
      text-align: center;
      position: relative;
      .single-video-img {
        display: inline-block;
        width: 3.65rem;
        height: 2.054rem;
        border-radius: .04rem;
      }
      .single-video-update {
        box-sizing: border-box;
        position: absolute;
        z-index: 22;
        right: 0;
        bottom: .02rem;
        font-size: .14rem;
        width: 3.65rem;
        height: .34rem;
        line-height: .34rem;
        color: #FFF;
        text-align: right;
        padding-right: .1rem;
        background-image: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .5) 100%);
        border-radius: 0 0 .04rem .04rem;
      }
    }
    .single-video-info {
      box-sizing: border-box;
      width: 3.65rem;
      padding-left: .05rem;
      padding-top: .05rem;
      .single-video-name {
        margin-bottom: .03rem;
        color: #111;
        font-size: .14rem;
        line-height: .18rem;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: normal;
      }
      .single-video-desc {
        color: #9D9D9D;
        font-size: .13rem;
        line-height: .16rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: normal;
      }
    }
  }

  .single-horizontal-video {
    display: inline-block;
    margin-bottom: .08rem;
    .single-video-img-wrap {
      display: inline-block;
      text-align: center;
      position: relative;
      .single-video-img {
        width: 1.8rem; /* 1.76rem+.03rem */
        height: 1.01rem;
        border-radius: .04rem;
      }
      .single-video-update {
        box-sizing: border-box;
        position: absolute;
        z-index: 22;
        right: 0;
        bottom: .03rem;
        font-size: .11rem;
        width: 1.8rem; /* 1.76rem+.03rem */
        height: .24rem;
        line-height: .24rem;
        color: #FFF;
        text-align: right;
        padding-right: .1rem;
        background-image: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .5) 100%);
        border-radius: 0 0 .04rem .04rem;
      }
    }
    .single-video-info {
      box-sizing: border-box;
      width: 1.8rem; /* 1.76rem+.03rem */
      padding-left: .05rem;
      padding-top: .03rem;
      .single-video-name {
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-bottom: .03rem;
        color: #111;
        font-size: .14rem;
        line-height: .18rem;
        font-weight: normal;
      }
      .single-video-subName {
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-bottom: .03rem;
        color: #9D9D9D;
        font-size: .13rem;
        line-height: .16rem;
        font-weight: normal;
      }
    }
  }

  .single-vertical-video {
    display: inline-block;
    margin-bottom: .12rem;
    .single-video-img-wrap {
      position: relative;
      .single-video-img {
        width: 1.18rem;
        height: 1.77rem;
        border-radius: .04rem;
      }
      .single-video-update {
        box-sizing: border-box;
        position: absolute;
        z-index: 22;
        right: 0;
        bottom: .03rem;
        font-size: .11rem;
        width: 1.18rem;
        height: .24rem;
        color: #FFF;
        text-align: right;
        padding-right: .1rem;
        line-height: .24rem;
        background-image: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .5) 100%);
        border-radius: 0 0 .04rem .04rem;
      }
    }
    .single-video-info {
      box-sizing: border-box;
      width: 1.18rem;
      padding-left: .05rem;
      padding-top: .03rem;

      .single-video-name {
        box-sizing: border-box;
        color: #4A4A4A;
        font-size: .14rem;
        line-height: .17rem;
        height: .17rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: normal;
      }
    }
  }

</style>
