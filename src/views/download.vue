<template>
<div class="download-wrap">
  <div class="rotate" v-if='showRotate' style="z-index: 1000">
    <img src="../assets/download/rotate.png" alt="">
    <div class="tip">请在竖屏状态下查看~</div>
  </div>
  <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
            <img src="../assets/download/1.jpg" alt="">
            <div class="btn"><a href="javascript:void(0);" @click="handleDownLoadClick">下载APP</a></div>
            <div class="next" @click="slideNext"></div>
        </div>
        <div class="swiper-slide">
            <img src="../assets/download/2.jpg" alt="">          
            <div class="btn"><a href="javascript:void(0);" @click="handleDownLoadClick">下载APP</a></div>
            <div class="next" @click="slideNext"></div>
            <div class="totop" @click="slideToFirst"></div>
        </div>
        <div class="swiper-slide">
            <img src="../assets/download/3.jpg" alt="">          
            <div class="btn"><a href="javascript:void(0);" @click="handleDownLoadClick">下载APP</a></div>
            <div class="next" @click="slideNext"></div>
            <div class="totop" @click="slideToFirst"></div>
        </div>
        <div class="swiper-slide">
            <img src="../assets/download/4.jpg" alt="">          
            <div class="btn"><a href="javascript:void(0);" @click="handleDownLoadClick">下载APP</a></div>
            <div class="next" @click="slideNext"></div>
            <div class="totop" @click="slideToFirst"></div>
        </div>
        <div class="swiper-slide">
            <img src="../assets/download/5.jpg" alt="">          
            <div class="btn"><a href="javascript:void(0);" @click="handleDownLoadClick">下载APP</a></div>
            <div class="totop" @click="slideToFirst"></div>
        </div>
      </div>
    </div>
</div>
</template>
<script>
import { wxShare } from '../util/wxShare.js';
export default {
    data () {
        return {
            slideIndex: 0,
            showRotate: false,
            swiperOption: {
                direction: 'vertical',
                onSlideChangeEnd: swiper => {
                    this.slideIndex = swiper.realIndex;
                }
            }
        };
    },
    methods: {
        slideToFirst() {
            this.mySwiper.slideTo(0);
        },
        slideNext() {
            this.mySwiper.slideNext();
        },
        checkOrientation() {
            if (window.orientation === 180 || window.orientation === 0) {
                this.showRotate = false;
            } else {
                this.showRotate = true;
            }
        },
        getUrlParam(name) {
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            const r = window.location.search.substr(1).match(reg);
            return r !== null ? decodeURIComponent(r[2].replace(/(\+)+/g, ' ')) : null;
        },
        countDownload() {
            var oReq = new XMLHttpRequest();
            const url = location.href;
            if (url.indexOf('?') > -1) {
                oReq.open('GET', url + '&downclick=1&t=' + ((new Date()).getTime()));
            } else {
                oReq.open('GET', url + '?downclick=1&t=' + ((new Date()).getTime()));
            }
            oReq.send();
        },
        handleDownLoadClick() {
            const ua = navigator.userAgent;
            let channel = this.getUrlParam('channel');
            this.countDownload();
            if (/MicroMessenger/i.test(ua)) {
                location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.daxiang.live';
            } else if (/android/i.test(ua)) {
                if (channel) {
                    location.href = `http://dx-downloads-test.itangchao.me/daxiang-live-A_${channel}-release.apk`;
                } else {
                    location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
                }
            } else if (/iPhone/i.test(ua)) {
                if (channel) {
                    location.href = `https://itunes.apple.com/app/apple-store/id1235011792?pt=118654704&ct=I_${channel}&mt=8`;
                } else {
                    location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
                }
            }
        }
    },
    mounted() {
        wxShare('有趣的人都在这里看视频', '无广告, 无会员, 超高清看片', 'http://dx-image-test.itangchao.me/logo_app_share_180_180.jpg');
        this.checkOrientation();
        window.addEventListener('orientationchange', () => {
            this.checkOrientation();
        });
    },
};
</script>
<style scoped>
.download-wrap {
  height: 100%;
  width: 100%;
}

.swiper-container {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}

.swiper-slide {
  position: relative;
  text-align: center;
  img {
    width: 100%;
  }
}

.btn {
  position: absolute;
  bottom: .4125rem;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
}

.btn,
.btn > a {
  width: 2.35rem;
  height: .42rem;
}

.btn > a {
  display: block;
  background: #F9BE00;
  color: #FFF;
  line-height: .42rem;
  font-weight: 500;
  font-size: 18px;
  border-radius: 50px;
}

.next {
  width: .225rem;
  height: .225rem;
  background-image: url(../assets/download/next.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;
  position: absolute;
  bottom: 8px;
  left: 50%;
  -webkit-transform: translateX(-.1125rem);
  -ms-transform: translateX(-.1125rem);
  transform: translateX(-.1125rem);
}

.totop {
  width: .3375rem;
  height: .3375rem;
  position: absolute;
  right: .225rem;
  bottom: .45rem;
  background-image: url('../assets/download/totop.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.rotate {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .8);
  & > img {
    width: 1.91rem;
    height: 1.05rem;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .tip {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translate(-50%, 0%);
    font-size: 12px;
    color: #FFF;
    margin: 0 auto;
  }
}
</style>
