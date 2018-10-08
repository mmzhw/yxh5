<template>
<!-- 我是微信其他浏览器打开页面 -->
  <div class="wechat-cover">
    <template v-if="isIOS">
      <img src="../../public/wechat_ios.png">
    </template>
    <template v-else>
      <img src="../../public/wechat_android.png">
    </template>
  </div>
</template>
<script>
import { jump } from '../util/jump';

export default {
    data () {
        return {
            pageUrl: '',
            frontPartUrl: 'jcgroup://youxiang.com/go?action=',
            latterPartUrl: '',
            isIOS: null
        };
    },
    mounted () {
        this.getType();
    },
    methods: {
        getUrl () {
            this.pageUrl = this.$route.fullPath;
        },
        getType () {
            let type = null;
            if (this.$route.query.shortVideoId) {
                type = 1;
            } else if (this.$route.query.action === 'personPage') {
                type = 2;
            } else if (this.$route.query.action === 'home') {
                type = 3;
            } else {
                type = 4;
            }
            const ua = navigator.userAgent;
            if (/iPhone/i.test(ua)) {
                this.isIOS = true;
            } else {
                this.isIOS = false;
            }
            /* 如果不是微信 且不是微博 */
            if (!/MicroMessenger/i.test(ua) && !/WeiBo/i.test(ua)) {
                this.toAppType(type);
            }
        },
        toAppType (type) {
            let q = this.$route.query || {};
            if (type === 1) {
                this.latterPartUrl = 'shortVideo&id=' + q.shortVideoId;
            } else if (type === 2) {
                this.latterPartUrl = 'personPage&id=' + q.id;
            } else if (type === 3) {
                this.latterPartUrl = 'home';
            } else {
                this.latterPartUrl = 'videoPlay&videoId=' + q.videoBaseId + '&videoDetailId=' + q.videoDetailId;
            };
            // alert('this.$route.query' + q.id);
            jump.openAppAndToDownloadPage(this.frontPartUrl + this.latterPartUrl);
            // location.href = this.frontPartUrl + this.latterPartUrl;
            // /* 下面的逻辑是判断如果没有 装app 就跳到下载页面的 */
            // // setTimeout(() => {
            // //     if (!this.isIOS) {
            // //         alert('setTimeout' + this.frontPartUrl + this.latterPartUrl);
            // //         location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
            // //     } else {
            // //         alert('setTimeout' + this.frontPartUrl + this.latterPartUrl);
            // //         location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
            // //     }
            // // }, 3000);
            // const now = Date.now();
            // setTimeout(() => {
            //     if (Date.now() - now < 1510) {
            //         if (!this.isIOS) {
            //             // alert('setTimeout' + this.frontPartUrl + this.latterPartUrl);
            //             location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
            //         } else {
            //             alert('setTimeout' + this.frontPartUrl + this.latterPartUrl);
            //             location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
            //         }
            //     }
            // }, 1500);
        },
    }
};
</script>
<style scoped>
.wechat-cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .8);
  & > img {
    width: 2.54rem;
    height: 1.87rem;
    position: absolute;
    top: .1rem;
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
  }
}

</style>
