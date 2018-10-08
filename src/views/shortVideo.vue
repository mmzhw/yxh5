<template>
  <div class="short-video-box">
    <div class="header-box">
      <div class="avatar">
        <img v-lazy="avatar">
      </div>
      <div class="nickName">
        <p class="nick">{{nickName}}</p>
        <p class="text">用有象，邀你在一起</p>
      </div>
      <div class="app-link" @click="appWatch">
        看看TA的故事
      </div>
    </div>
    <div class="player-box" :style="screenH">
      <template v-if="deleteStatus">
        <div class="err-info">
          <img src="../../public/shortVideoErr.png" class="delete-img">
          <div class="err-txt" style="color: #C9C7C8;">
            本视频被脑洞大开的原创作者删除啦， 快去看看别的视频吧~
          </div>
        </div>
      </template>
      <template v-else>
        <video-player :options="vOptions" :hideDownload="hideDownload"></video-player>
        <div class="detailTitle">{{shareTitle}}</div>
        <template v-if="bytesCount <= 30">
          <div class="detailIntroduction">{{shareIntroduction}}</div>
        </template>
        <template v-else>
          <marquee class="detailIntroduction">{{shareIntroduction}}</marquee>
        </template>
        <div class="count-box" @click="appWatch">
          <div class="likeCount">
            <img src="../../public/shortVideo_like.png">
            <span>
            {{likeCount}}
          </span>
          </div>
          <div class="shareCount">
            <img src="../../public/shortVideo_share.png">
            <span>
             {{shareCount}}
          </span>
          </div>
        </div>
      </template>
    </div>
    <div class="listTitle">—— 今日热门推荐 ——</div>
    <div class="video-list">
      <div @click="gotoDownload(item.id)" class="video-box" v-for="item in videoList" :style="'background: url('+item.picUrl+');'">
        <!--<div class="cover"><span class="iconfont icon-play"></span></div>-->
        <div class="listSingleVideoTitle">{{item.title}}</div>
      </div>
      <div class="more">
        更多精彩，请前往客户端体验
      </div>
    </div>
  </div>
</template>
<script>
import { wxShare } from '../util/wxShare.js';
import videoPlayer from '../components/video/Video.vue';
export default {
    data () {
        return {
            vOptions: {
                sources: [],
                controls: true,
                poster: '',
            },
            avatar: '',
            nickName: '',
            videoList: [],
            shareIntroduction: '',
            shareTitle: '',
            hideDownload: true,
            deleteStatus: false,
            bytesCount: 0,
            likeCount: 0,
            shareCount: 0,
            showCover: false,
            isIOS: null,
            screenH: {
                height: ''
            }
        };
    },
    components: {
        videoPlayer
    },
    updated() {
        this.getscreen();
    },
    methods: {
        getscreen () {
            this.screenH.height = document.body.clientHeight + 'px';
        },
        getVideoDetail () {
            let id = this.$route.params.videoId;
            this.axios.post('/m_web/video/getMVideoShortDetail', { 'id': id })
      .then((res) => {
          let data = res.data;
          this.vOptions.poster = data.picUrl;
          if (data.status === 1) {
              this.vOptions.sources = [{
                  src: data.playUrl,
                  type: 'video/mp4',
              }];
          } else {
              this.deleteStatus = true;
          }
          this.avatar = data.avatar;
          this.nickName = data.nickName || ' ';
          this.shareTitle = data.title;
          this.likeCount = data.likeCount > 9999 ? (data.likeCount / 10000).toFixed(1) + 'w' : data.likeCount;
          this.shareCount = data.shareCount > 9999 ? (data.shareCount / 10000).toFixed(1) + 'w' : data.shareCount;
          this.shareIntroduction = data.introduction || '';
//        wxShare(this.shareTitle, '@' + this.nickName + '发了一个有趣的有象短视频，快去围观打call吧~', this.vOptions.poster)
          wxShare('@' + this.nickName + '发了一个有趣的有象短视频，快去围观打call吧~', this.shareTitle + ',' + this.shareIntroduction, this.vOptions.poster);
          for (let i = 0; i < this.shareIntroduction.length; i++) {
              let c = this.shareIntroduction.charAt(i);
              if (/^[\u0000-\u00ff]$/.test(c)) {
                  this.bytesCount += 1;
              } else {
                  this.bytesCount += 2;
              }
          }
      }).catch((err) => {
          // this.$router.push({ name: 'notFound' });
          console.error(err);
      });
        },
        getVideoList () {
            let offset = Math.floor((Math.random() * 260) + 1);
            this.axios.post('/m_web/video/getMVideoList', { 'offset': offset, 'limit': 12 })
        .then((res) => {
            let data = res.data;
            this.videoList = data.videoShortVos;
        })
        .catch((err) => {
            console.error(err);
        });
        },
        gotoDownload(id) {
            this.appUrl(id);
        },
        appWatch() {
            let id = this.$route.params.videoId;
            this.appUrl(id);
        },
        appUrl (id) {
            const ua = navigator.userAgent;
            if (/MicroMessenger/i.test(ua)) {
                if (/iPhone/i.test(ua)) {
                    this.isIOS = true;
                } else {
                    this.isIOS = false;
                }
                location.href = location.origin + '/browserOpen?shortVideoId=' + this.$route.params.videoId;
            } else {
                location.href = 'jcgroup://youxiang.com/go?action=shortVideo&id=' + id;
                setTimeout(() => {
                    if (/android/i.test(ua)) {
                        location.href = 'http://dx-downloads-test.itangchao.me/daxiang-live-A_OFFICAL-release.apk';
                    } else if (/iPhone/i.test(ua)) {
                        location.href = 'https://itunes.apple.com/us/app/id1235011792?l=zh&ls=1&mt=8';
                    }
                }, 3000);
            }
        }
    },
    created () {
        this.getVideoDetail();
        this.getVideoList();
    },
    watch: {
        '$route.params.videoId': {
            handler: function(newSources, oldSources) {
                this.getVideoDetail();
                this.getVideoList();
            },
            deep: true
        }
    },
    mounted() {
//    window.addEventListener('orientationchange', () => {
//      this.checkOrientation()
//    })
    },
};
</script>
<style scoped>
.short-video-box {
  width: 100% !important;
  overflow: hidden;
  color: #FFF;
  background: #000;
  .header-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    background: rgba(0, 0, 0, .8);
    height: .8rem;
    width: 100%;
    .avatar {
      width: .6rem;
      height: .6rem;
      border-radius: 50%;
      margin-top: .1rem;
      margin-left: .18rem;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .nickName {
      float: left;
      margin-left: .15rem;
      margin-top: .17rem;
      width: 1.26rem;
      height: .5rem;
      .nick {
        color: #FFBD00;
        font-size: .15rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        overflow: hidden;
      }
      .text {
        margin-top: .1rem;
      }
      .text::after {
        content: '';
        display: table;
        clear: both;
      }
    }
    .app-link {
      width: 1.14rem;
      height: .38rem;
      background: #FFBD00;
      color: #FFF;
      float: left;
      margin-left: .2rem;
      margin-top: .2rem;
      border-radius: .05rem;
      line-height: .38rem;
      text-align: center;
    }
  }
  .player-box {
    position: relative;
    z-index: 10;
    .err-info {
      text-align: center;
      height: 1.42rem;
      margin-top: 1.42rem;
      .delete-img {
        width: .8rem;
        height: .8rem;
        margin: 0 auto;
      }
      .err-txt {
        width: 2.55rem;
        height: .42rem;
        line-height: .21rem;
        text-align: center;
        margin-left: .6rem;
        margin-top: .2rem;
      }
    }
    .detailTitle {
      position: absolute;
      left: .12rem;
      right: .12rem;
      bottom: .6rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .detailIntroduction {
      position: absolute;
      left: .12rem;
      bottom: .4rem;
      width: 2.2rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .count-box {
      position: absolute;
      top: 50%;
      right: .14rem;
      transform: translate(0, -50%);
      -webkit-transform: translate(0, -50%);
      -ms-transform: translate(0, -50%);
      -o-transform: translate(0, -50%);
      .likeCount {
        height: .53rem;
        width: .34rem;
        img {
          width: 100%;
        }
        span {
          text-align: right;
          display: inline-block;
          position: relative;
          width: .6rem;
          bottom: 0;
          right: .3rem;
        }
      }
      .shareCount {
        margin-top: .2rem;
        height: .53rem;
        width: .34rem;
        img {
          width: 100%;
        }
        span {
          text-align: right;
          display: inline-block;
          position: relative;
          width: .6rem;
          bottom: 0;
          right: .3rem;
        }
      }
    }
  }
  .player-box::before {
    content: '';
    display: table;
  }
  .listTitle {
    height: .22rem;
    margin-top: .18rem;
    margin-bottom: .16rem;
    line-height: .36rem;
    text-align: center;
  }
  .video-list {
    /* padding-bottom: .24rem; */
    .video-box {
      width: 1.87rem; /* old 1.82; */
      height: 2.42rem;
      display: inline-block;
      position: relative;
      background-size: 100% !important;
    }
    .video-box:nth-child(2n) {
      margin-left: .01rem; /* .1 */
    }
    .cover {
      position: absolute;
      top: 50%;
      left: 50%;
      width: .5rem;
      height: .5rem;
      line-height: .5rem;
      text-align: center;
      background: rgba(0, 0, 0, .5);
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      border-radius: 50%;
    }
    .more {
      width: 100%;
      height: .54rem;
      line-height: .54rem;
      text-align: center;
      color: #464851;
    }
    .listSingleVideoTitle {
      height: .2rem;
      width: 1.75rem;
      line-height: .2rem;
      padding: .06rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
