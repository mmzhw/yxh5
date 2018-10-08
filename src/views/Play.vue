<template>
  <div class="play">
    <div :class="{'move-right': navFlag}">
      <playHeader :style="{position: 'fixed', top: 0, zIndex: 99}" v-on:openleftbar="openLeftBar"></playHeader>
      <div class="player-wrap" :style="{paddingTop: .5 + 'rem'}">
        <video-player :isMoveRight="navFlag" :options="vOptions" :isEnded="isEnded" @onNextVideo="gotoEpisode(videoInfos.vVideoDetailRspVos[videoInfos.currentIndex+1].videoDetailId)"></video-player>
      </div>
      <button class="jump-app" @click="gotoDownload">看高清完整版，安装有象视频</button>
      <div class="video-info">
        <label>{{videoInfos.name}}</label>
        <i class="iconfont icon-back"
          :class="videoSummaryShow ? 'upside' : ''"
          @click="videoSummaryShow = !videoSummaryShow"
        ></i>
        <div class="video-actor">演员：<span>{{videoInfos.actor}}</span></div>
        <transition name="slide-fade">
          <div class="video-summary" v-show="videoSummaryShow">简介：<span>{{videoInfos.intro}}</span></div>
        </transition>
      </div>
      <div class="episode-area" v-if="videoInfos.categories === 2">
        <label>剧集</label>
        <span class="episode-display">{{videoInfos.extMap.updateEpisode}}</span>
        <div class="episode-wrap" ref="episodesTV" v-if="videoInfos.bizType === 1" :style="{height: .75 + 'rem', overflow: 'hidden'}">
          <ul :style="{height: .85 + 'rem', overflowY: 'hidden'}">
            <li class="episode-tv" v-for="(episode, index) in episodes"
              :class="episode.episodeDisplay === currEpisode ? 'episode-active' : ''"
              @click="episode.episodeDisplay === currEpisode ? '' : gotoEpisode(episode.videoDetailId)"
            >
              <img src="../assets/play/play-active.svg" alt="" v-if="episode.episodeDisplay === currEpisode">
              <span v-else>{{episode.episodeDisplay}}</span>
            </li>
          </ul>
        </div>
        <div class="episode-wrap" ref="episodesVariety" v-if="episodes.length > 0 && videoInfos.bizType === 2" :style="{height: 1.23 + 'rem', overflow: 'hidden'}">
          <ul :style="{height: 1.33 + 'rem', overflowY: 'hidden'}">
            <li class="episode-variety" v-for="(episode, index) in episodes"
              :class="episode.episodeDisplay === currEpisode ? 'episode-variety-active' : ''"
              @click="episode.episodeDisplay === currEpisode ? '' : gotoEpisode(episode.videoDetailId)"
            >
              <div class="episode-variety-img">
                <img v-lazy="imageUrl + episode.images[0].url" alt="">
                <span>{{episode.episodeDisplay}}</span>
              </div>
              <p>{{episode.title}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="recommend-area">
        <label class="recommend-title">精彩推荐</label>
        <div class="recommend-wrap" v-if="recommendLists && recommendLists.length !== 0">
          <ul class="recommend-list" v-if="videoInfos.categories === 1">
            <router-link :to="{name:'Play', params: {videoBaseId: item.videoBaseId}}" :key="i" v-for="(item, i) in recommendLists" tag="li">
              <img v-lazy="imageUrl + item.imgUrl" alt="">
              <span v-if="item.extMap.updateEpisode">{{item.extMap.updateEpisode}}</span>
              <p>{{item.name}}</p>
            </router-link>
          </ul>
          <ul class="recommend-episode-list" v-else>
            <router-link :to="{name:'Play', params: {videoBaseId: item.videoBaseId}}" :key="i" v-for="(item, i) in recommendLists" tag="li">
              <img v-lazy="imageUrl + item.imgUrl" alt="">
              <span v-if="item.extMap.updateEpisode">{{item.extMap.updateEpisode}}</span>
              <p>{{item.name}}</p>
            </router-link>
          </ul>
        </div>
        <div class="recommend-none" v-if="recommendLists && recommendLists.length === 0 && recommendFlag">暂无推荐视频</div>
      </div>
    </div>
    <div class="float-nav" @click="navFlag = false" v-show="navFlag">
      <ul v-show="navFlag">
        <li @click="gotoNav(0)">精选</li>
        <li v-for="item in channelLists" @click="gotoNav(item.id)">{{item.name}}</li>
      </ul>
    </div>
    <!--<Jumpbar></Jumpbar>-->
    <div class="wechat-cover" v-if="showCover">
      <template v-if="isIOS">
        <img src="../../public/wechat_ios.png">
      </template>
      <template v-else>
        <img src="../../public/wechat_android.png">
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import Jumpbar from '../components/jumpbar/Jumpbar.vue'
import playHeader from '../components/header/playHeader.vue';
import videoPlayer from '../components/video/Video.vue';
import { videoUrl, imageUrl } from '../util/index.js';
// import { jump } from '../util/jump.js'
import { wxShare } from '../util/wxShare.js';
import titleMixin from '../mixins/title-mixin';

export default {
    name: 'play',

    mixins: [titleMixin],

    title () {
        return `${this.videoInfos.name} ${this.videoInfos.vVideoDetailRspVos[this.videoInfos.currentIndex].episodeDisplay}`;
    },

    components: {
//    Jumpbar,
        videoPlayer,
        playHeader
    },

    data () {
        return {
            channelLists: [],
            videoBaseId: '',
            videoDetailId: '',
            episodes: [],
            currEpisode: '',
            videoSummaryShow: false,
            imageUrl: '',
            recommendLists: [],
            navFlag: false,
            vOptions: {
                sources: [],
                controls: true,
                poster: '',
                videoBaseId: '',
                videoDetailId: '',
            },
            we_chat_share: {
                title: '',
                subTitle: '',
                imgUrl: '',
                shareUrl: ''
            },
            recommendFlag: false, // 数据是否拉取成功标识
            isMoveRight: false,
            showCover: false,
            isIOS: null
        };
    },

    asyncData({ store, route }) {
        return store.dispatch('FETCH_VIDEOINFO', route);
    },

    computed: {
        ...mapState({
            videoInfos: state => {
                return state.videoInfo;
            }
        }),
        isEnded() {
            if (this.videoInfos.vVideoDetailRspVos.length && this.videoInfos.currentIndex + 1 < this.videoInfos.vVideoDetailRspVos.length) {
                return false;
            }
            return true;
        },
//    limit() {
//      return this.videoInfo.categories === 1 ? 15 : 16
//    }
    },

    created() {
        this.imageUrl = imageUrl;
        this.videoBaseId = this.$route.params.videoBaseId;
        this.videoDetailId = this.$route.query.videoDetailId;
        this
      .fetchChannelData()
      .then(() => {
          this.fetchVideoRecommend(this.videoBaseId);
      });
//    this.fetchChannelData()
    },

    mounted() {
        this.dealVideoData(this.videoInfos);
    },

    watch: {
        '$route.params.videoBaseId': {
            handler: function(newSources, oldSources) {
                this.we_chat_share.shareUrl = location.protocol + '//' + location.host + this.$route.fullPath;
//        console.log(this.we_chat_share.shareUrl)
                this.wechatShareForApp();
                this.videoBaseId = this.$route.params.videoBaseId;
                this.videoDetailId = this.$route.query.videoDetailId;
                this
          .fetchChannelData()
          .then(() => {
              this.fetchVideoRecommend(this.videoBaseId);
          });
            },
            deep: true
        },
        'videoInfos': {
            handler: function(newVal, oldVal) {
                this.dealVideoData(newVal);
            },
            deep: true
        },
    },

    methods: {
        wechatShareForApp (title, subTitle, img) {
            const jsBridge = require('../util/bridge');
            if (title) {
                this.we_chat_share.title = title;
                this.we_chat_share.subTitle = subTitle;
                this.we_chat_share.imgUrl = img;
            }
            jsBridge.call('base_callShareContent', this.we_chat_share, () => {});
        },
        dealVideoData(videoInfos) {
            this.currEpisode = videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].episodeDisplay;
            this.episodes = videoInfos.vVideoDetailRspVos.map((item) => {
                return {
                    episodeDisplay: item.episodeDisplay,
                    title: item.title,
                    videoDetailId: item.videoDetailId,
                    images: item.images,
                    subTitle: item.subTitle,
                };
            });
      // 筛选16:9图片
            let videoPoster = '';
            videoInfos.images.forEach(item => {
                if (item.scale === 1) {
                    videoPoster = item.url;
                }
            });
            if (!videoPoster) {
                videoPoster = videoInfos.images[0].url;
            }
            this.vOptions.poster = imageUrl + videoPoster;

            this.vOptions.videoBaseId = this.videoBaseId;
            this.vOptions.videoDetailId = this.videoDetailId;
            this.recommendFlag = true;
            let shareImg = {};
            videoInfos.images.forEach(img => {
                img.scale === 1 ? shareImg = img : '';
            });
            let shareImgUrl = 'https://image.youxiang0210.com/wechat-share.png';
            if (shareImg) {
                shareImgUrl = imageUrl + shareImg.url + '!800';
            }
      // 剧集或者综艺
            this.we_chat_share.shareUrl = location.href;
            if (videoInfos.categories === 2) {
                let episodeInfos = {};
                this.episodes.forEach(item => {
                    if (item.videoDetailId === this.videoDetailId) {
                        item.images.forEach(img => {
                            img.scale === 1 ? shareImgUrl = imageUrl + img.url : '';
                        });
                        if (videoInfos.bizType === 1) { // 电视剧
                            episodeInfos.name = `${item.title} 第${item.episodeDisplay}集`;
                        } else if (videoInfos.bizType === 2) { // 综艺
                            episodeInfos.name = `${item.title} ${item.episodeDisplay}期`;
                        }
                        episodeInfos.subTitle = item.subTitle;
                    }
                });
                let subT = episodeInfos.subTitle || videoInfos.subName || episodeInfos.name;
                wxShare(episodeInfos.name, subT, shareImgUrl);
                this.wechatShareForApp(episodeInfos.name, subT, shareImgUrl);
            } else {
                let subT = videoInfos.subName || videoInfos.name;
                wxShare(videoInfos.name, subT, shareImgUrl);
                this.wechatShareForApp(videoInfos.name, subT, shareImgUrl);
            }
      // 筛选要播放的源
            const mp4Lists = videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].videoResourceStatusVo.mp4Claritys;
            let playSourceUrl = '';
            mp4Lists.forEach(item => {
                if (item.clarity === '480P') {
                    playSourceUrl = item.url;
                }
            });
            if (!playSourceUrl) {
                playSourceUrl = mp4Lists[0].url;
            }
            const videoSources = mp4Lists.map(item => {
                return {
                    src: videoUrl + item.url,
                    type: 'video/mp4',
                    label: item.clarity,
                    res: item.clarity.slice(0, item.clarity.length - 1)
                };
            });
            this.vOptions.sources = videoSources;

      // 移动剧集至当前播放项目
            if (videoInfos.categories === 2) {
                if (videoInfos.bizType === 1) {
                    this.$nextTick(() => {
                        this.$refs.episodesTV.scrollLeft = document.querySelector('.episode-active').offsetLeft;
                    });
                } else {
                    this.$nextTick(() => {
                        this.$refs.episodesVariety.scrollLeft = document.querySelector('.episode-variety-active').offsetLeft;
                    });
                }
            }
        },
        dealImg() {

        },
    // fetchVideoData(videoBaseId, videoDetailId) {
    //   this.axios.post('/m_web/videoBase/videoBaseInfo', {
    //     videoBaseId,
    //     videoDetailId,
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       this.videoInfos = res.data
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })
    // },
        fetchVideoRecommend(videoBaseId) {
//      const limit = this.videoInfos.categories === 1 ? 15 : 16 // 原先单视频是纵向图片，每行3个
            const limit = 18;
            this.axios.post('/m_web/channel/recommend', {
                limit,
                videoBaseId,
            }).then((res) => {
                this.recommendLists = res.data;
                this.getRecommendImage();
            })
      .catch((err) => {
          console.error(err);
      });
        },
    // 根据categories取图
        getRecommendImage() {
            this.recommendLists.forEach(item => {
                if (this.videoInfos.categories === 1) {
                    item.images.forEach(image => {
//            if (image.scale === 3) {
                        if (image.scale === 1) {
                            item.imgUrl = image.url;
                        }
                    });
                } else if (this.videoInfos.categories === 2) {
                    item.images.forEach(image => {
                        if (image.scale === 1) {
                            item.imgUrl = image.url;
                        }
                    });
                }
            });
        },
        gotoEpisode(id) {
            this.$router.push({
                name: 'Play',
                params: { videoBaseId: this.videoBaseId },
                query: { videoDetailId: id },
            });
        },
        gotoNav(id) {
            this.$router.push({
                name: 'Index',
                params: { channelId: id },
            });
        },
        fetchChannelData() {
            return this.axios.post('/m_web/ableChannel', {}).then((res) => {
                this.channelLists = res.data;
            })
      .catch((err) => {
          console.error(err);
      });
        },
        gotoDownload() {
//      jump.linkAppVideo(this.videoBaseId, this.videoDetailId)
            const ua = navigator.userAgent;
            if (/MicroMessenger/i.test(ua)) {
                this.showCover = true;
                if (/iPhone/i.test(ua)) {
                    this.isIOS = true;
                } else {
                    this.isIOS = false;
                }
            } else {
                location.href = 'jcgroup://youxiang.com/go?action=videoPlay&videoId=' + this.videoBaseId + '&videoDetailId=' + this.videoDetailId;
                const now = Date.now();
                setTimeout(() => {
                    if (Date.now() - now < 1580) {
                        this.$router.push({
                            name: 'download'
                        });
                    }
                }, 1500);
            }
        },
        openLeftBar() {
            this.navFlag = true;
        }
    }
};
</script>

<style scoped>
.play {
  overflow-x: hidden;
  width: 100%;
  .wechat-cover {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 90 !important;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, .8);
    & > img {
      width: 2.54rem;
      height: 1.87rem;
      position: absolute;
      top: .8rem;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}

.player-wrap {
  width: 100%;
  height: 2.11rem;
  background: #666;
  position: relative;
}

.jump-app {
  display: block;
  margin: .1rem auto;
  width: 3.55rem;
  height: .4rem;
  background: #FABE00;
  border: none;
  border-radius: .04rem;
  color: #FFF;
  font-size: .16rem;
}

.video-info {
  width: calc(100% - .1rem);
  box-sizing: border-box;
  padding: .1rem .1rem .1rem 0;
  margin-left: .1rem;
  border-bottom: .01rem solid #EBEBEB;
  label {
    color: #222;
    font-size: .2rem;
    font-weight: bold;
  }
  i {
    margin-right: .1rem;
    float: right;
    margin-top: .04rem;
    display: inline-block;
    color: #9B9B9B;
    font-size: .17rem;
    transition: .3s;
    transform: rotate(180deg);
    &.upside {
      transform: rotate(0deg);
    }
  }
}

.video-actor,
.video-summary {
  color: #4A4A4A;
  margin: .05rem 0;
  span {
    color: #9B9B9B;
    line-height: .2rem;
  }
}

.slide-fade-enter-active {
  transition: all .3s ease-in-out;
}

.slide-fade-leave-active {
  transition: all .3s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(-10px);
  opacity: 0;
}

.episode-area {
  width: 3.55rem;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 1.2rem;
  border-bottom: .01rem solid rgba(216, 216, 216, .2);
  padding: .15rem 0;
  label {
    color: #222;
    font-size: .16rem;
    font-weight: bold;
  }
}

.episode-display {
  float: right;
  color: #9D9D9D;
  margin-top: .02rem;
}

.episode-wrap {
  width: 100%;
  min-height: .75rem;
  ul {
    min-width: 100%;
    white-space: nowrap;
    li.episode-tv {
      position: relative;
      display: inline-block;
      background: #F2F3F6;
      margin-top: .2rem;
      padding: .18rem .2rem;
      margin-right: .05rem;
      border-radius: .06rem;
      span {
        color: #222;
        text-align: center;
      }
      img {
        width: .11rem;
        transform: scale(1.5);
      }
    }
    li.episode-variety {
      display: inline-block;
      margin-top: .2rem;
      margin-right: .05rem;
      border-radius: .06rem;
      p {
        color: #4A4A4A;
        text-align: left;
        margin-top: .05rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 1.4rem;
        padding-left: 5px;
      }
      img {
        display: block;
        width: 1.4rem;
        height: .79rem;
        border-radius: .04rem; /* 圆角 新增 */
      }
      span {
        display: inline-block;
        box-sizing: border-box;
        position: absolute;
        width: 1.4rem;
        height: .236rem;
        padding: .066rem .08rem;
        bottom: 0;
        text-align: right;
        color: #FFF;
        font-size: .12rem;
      }
    }
  }
}

.episode-variety-img {
  position: relative;
}

.episode-variety-active {
  .episode-variety-img {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 1.4rem;
      height: 100%;
      z-index: 1;
      border-radius: .04rem; /* 修复遮罩层播放框的圆角 */
      background: rgba(0, 0, 0, .6);
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      width: 16px;
      height: 18px;
      z-index: 1;
      background: url(../assets/play/play-active.svg) no-repeat;
    }
  }
  p {
    color: #FABE00 !important;
  }
}

.recommend-area {
  width: 3.55rem;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 1.2rem;
  padding: .18rem 0;
  label {
    display: block;
    color: #222;
    font-size: .16rem;
    margin-bottom: .1rem;
    font-weight: bold;
  }
}

.recommend-list {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 1.72rem; /* width: 1.75rem; 原来是纵向1.15rem */
    margin-right: .05rem;
    position: relative;
    img {
      width: 100%;
      height: .98rem;  /* height: .98rem; 原来是纵向1.72rem */
      border-radius: .04rem; /* 圆角 新增 */
    }
    span {
      position: absolute;
      right: 0;
      bottom: .3rem;
      width: 100%;
      height: .236rem;
      line-height: .236rem;
      box-sizing: border-box;
      padding-right: .1rem;
      text-align: right;
      color: #FFF;
      font-size: .12rem;
      border-radius: 0 0 .04rem .04rem;
      background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .7) 100%);
    }
    p {
      color: #4A4A4A;
      padding: .02rem .05rem .1rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}

.recommend-episode-list {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 1.75rem;
    margin-right: .05rem;
    position: relative;
    img {
      width: 100%;
      height: .98rem;
      border-radius: .04rem; /* 圆角 新增 */
    }
    span {
      position: absolute;
      right: 0;
      bottom: .3rem;
      width: 100%;
      height: .236rem;
      line-height: .236rem;
      box-sizing: border-box;
      padding-right: .1rem;
      text-align: right;
      color: #FFF;
      font-size: .12rem;
      border-radius: 0 0 .04rem .04rem;
      background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .7) 100%);
    }
    p {
      color: #4A4A4A;
      padding: .02rem .05rem .1rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}

.recommend-none {
  text-align: center;
  color: #999;
  margin-top: .3rem;
}

.slide-right-enter-active {
  transition: all .2s ease-in-out;
}

.slide-right-leave-active {
  transition: all .2s ease-in-out;
}

.slide-right-enter,
.slide-right-leave-active {
  transform: translateX(-1rem);
  opacity: 0;
}

.float-nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  text-align: center;
  z-index: 999;
  background: rgba(0, 0, 0, .4);
  ul {
    width: 1.6rem;
    height: 100%;
    background: #FFF;
    li {
      height: .5rem;
      line-height: .5rem;
      border-bottom: .01rem solid #F1F1F1;
    }
  }
}

.move-right {
  transform: translate3d(1.6rem, 0, 0);
}
</style>
