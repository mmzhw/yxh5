<template>
  <div class="video-list">
    <template v-if="layOut === 'layOut1'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <div class="videos-wrap videos-layOut1-wrap">
        <SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item" mode="large"/>
      </div>
      <div class="list-line"></div>
    </template>
    <template v-if="layOut === 'layOut2'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <div class="videos-wrap videos-layOut2-wrap">
        <SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item" mode="horizontal"/>
      </div>
      <div class="list-line"></div>
    </template>
    <template v-if="layOut === 'layOut3'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <div class="videos-wrap videos-layOut3-wrap">
        <SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item" mode="vertical"/>
      </div>
      <div class="list-line"></div>
    </template>
    <template v-if="layOut === 'layOut4'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <div class="videos-wrap videos-layOut4-wrap">
        <SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item" :mode="layOut4Mode(index)"/>
      </div>
      <div class="list-line"></div>
    </template>
    <template v-if="layOut === 'layOut5'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <div class="videos-wrap videos-layOut5-wrap">
        <SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item" :mode="layOut5Mode(index)"/>
      </div>
      <div class="list-line"></div>
    </template>
    <!--  滑动模板8  -->
    <template v-if="layOut === 'layOut8'">
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <RecommendVideos v-for="(item, index) in newModelRecommendLists" :key="index" :singleRecommendVideo="item"/>
      <div class="videos-layOut8-wrap">
        <!--<SingleVideo v-for="(item, index) in videoData.videos" :key="index" :singleVideoData="item.type === 2 ? item : null" mode="horizontal"/>-->
        <SingleCarouselVideo v-if="item.scale === 1" v-for="(item, index) in videoData.videos" :key="index" :singleCarouselVideo="item.scale === 1 ? item : null"  mode="horizontal"/>
      </div>
    </template>
    <!--  新模板9 有可配置头图 推荐视频等  -->
    <template v-if="layOut === 'layOut9'">
      <div class="new-model-header-img" v-if="videoData.adEnable && adData">
        <div class="list-black-bg"></div>
        <router-link v-if="adData.videoId" :to="{name: 'Play', params: { videoBaseId: adData.videoId }}">
          <img :src="imageUrl + adData.imageUrl">
        </router-link>
        <a v-if="adData.url" :href="adData.url">
          <img :src="imageUrl + adData.imageUrl">
        </a>
      </div>
      <div class="list-black-bg" v-if="videoData.adEnable === 0"></div>
      <AllModelsTitle :title="videoData.title" :channelId="channelId" :icon="videoData.iconImgUrl" />
      <RecommendVideos v-for="(item, index) in newModelRecommendLists" :key="index" :singleRecommendVideo="item"/>
      <div class="videos-wrap videos-layOut9-wrap">
        <SingleVideo v-for="(item, index) in mode9showArr" :key="index" layout="9" :singleVideoData="item" mode="horizontal"/>
      </div>
      <!-- 新模板9 底部按钮 -->
      <div class="bottomBtns">
        <router-link tag="div" class="moreVideos" :to="{name:'Index', params: {channelId: videoData.moreId}}"><img src="../../assets/indexChannel/homeMore.png" alt=""><span>查看更多</span></router-link>
        <i class="verticalLine"></i>
        <div class="otherPage" @click="changePageNum"><img src="../../assets/indexChannel/homeChange.png" alt=""><span>换一批</span></div>
      </div>
    </template>
  </div>
</template>
<script>
import SingleVideo from '../singleVideo/SingleVideo.vue';
import AllModelsTitle from '../allModelsTitle/allModelsTitle.vue';
import SingleCarouselVideo from '../newModelCarousel/newModelCarousel.vue';
import RecommendVideos from '../recommendVideos/recommendVideos.vue';
import { imageUrl } from '../../util/index.js';
export default {
    name: 'video-list',
    components: {
        SingleVideo,
        RecommendVideos,
        SingleCarouselVideo,
        AllModelsTitle
    },
    props: ['videoData', 'channelId'],
    data () {
        return {
            adData: {}, // 9号模板广告图
            newModelRecommendLists: [], // 推荐标题
            model9VideoList: [], // 11条数据
            mode9showArr: [], // 4条当前显示的列表
            currentPageNo: 1, // 分页
            headerImg: {} // 广告图
        };
    },
    created() {
        this.imageUrl = imageUrl;
    },
    computed: {
        layOut () {
            if (this.videoData.layoutId === 1) {
                return 'layOut1';
            }
            if (this.videoData.layoutId === 2) {
                return 'layOut2';
            }
            if (this.videoData.layoutId === 3) {
                return 'layOut3';
            }
            if (this.videoData.layoutId === 4) {
                return 'layOut4';
            }
            if (this.videoData.layoutId === 5) {
                return 'layOut5';
            }
      // 2017-12-21 旧模板6，7未开发作废，  新增模板 8 ，9
            if (this.videoData.layoutId === 8) {
                this.getRecommendTitles();
                return 'layOut8';
            }
            if (this.videoData.layoutId === 9) {
                this.getRecommendTitles();
                this.upview9Mode();
                return 'layOut9';
            }
        }
    },
    mounted () {
        if (this.videoData.layoutId === 3 && this.videoData.videos.length > 6) {
            this.videoData.videos = this.videoData.videos.slice(0, 6);
        }
        if (this.videoData.layoutId === 5 && this.videoData.videos.length > 5) {
            this.videoData.videos = this.videoData.videos.slice(0, 5);
        }
    },
    methods: {
        layOut4Mode (index) {
            if (index === 0) {
                return 'large';
            } else {
                return 'vertical';
            }
        },
        layOut5Mode (index) {
            if (index === 0) {
                return 'large';
            } else {
                return 'horizontal';
            }
        },
        getRecommendTitles () {
            this.newModelRecommendLists = [];
            for (let item of this.videoData.videos) {
                if (item.scale === 0) {
                    this.newModelRecommendLists.push(item);
                }
            }
        },
        upview9Mode () {
            this.adData = {};
            this.model9VideoList = [];
            for (let item of this.videoData.videos) {
                if (item.scale === 1) {
                    this.model9VideoList.push(item);
                }
                if (item.scale === 6 && this.videoData.adEnable) {
                    this.adData = item;
                }
            }
            if (this.currentPageNo === 1) {
                this.mode9showArr = this.model9VideoList.slice(0, 4);
            } else {
                this.mode9showArr = this.model9VideoList.slice(4, this.model9VideoList.length);
            }
        },
        changePageNum () {
            if (this.currentPageNo === 1) {
                this.currentPageNo = 2;
            } else {
                this.currentPageNo = 1;
            }
            if (this.currentPageNo === 1) {
                this.mode9showArr = this.model9VideoList.slice(0, 4);
            } else {
                this.mode9showArr = this.model9VideoList.slice(4, this.model9VideoList.length);
            }
        }
    }
};
</script>

<style scoped>
.video-list {
  position: relative;
  padding: .05rem 0 .08rem;
  overflow-x: hidden;/* 8号模板滚动新增样式 */
  overflow-y: hidden;/* 8号模板滚动新增样式 */
  .list-black-bg {
    width: 3.65rem;
    height: .01rem;
    background-color: #EEE;
    margin-bottom: .06rem;
    margin-left: .05rem;
  }
  & > .new-model-header-img {
    height: 1.82rem;
    .list-black-bg {
      margin-bottom: .22rem;
    }
    & img {
      width: 3.65rem;
      height: 1.4rem;
      margin-left: .05rem;
      border-radius: .04rem;
    }
  }
  .list-line {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #EBEBEB;
    width: 98%;
    height: 1px;
  }
  .videos-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0 .03rem;
  }
  .videos-layOut8-wrap {
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    margin-bottom: .08rem;
    & > a:first-child {
      display: inline-block;
      width: 1.76rem;
      height: 1.01rem;
      margin-left: .05rem;
    }
    & > a {
      display: inline-block;
      width: 1.76rem;
      height: 1.01rem;
      margin-right: .05rem;
    }
  }
  .videos-layOut8-wrap,
  .videos-layOut9-wrap {
    margin-top: .1rem;
  }
  .bottomBtns {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    padding: 0  .03rem;
    height: .4rem;
    & > div {
      flex: 1;
      -webkit-flex: 1;
      font-size: .16rem;
      color: rgb(253, 189, 1);
      font-weight: bold;
      text-align: center;
      img {
        position: relative;
        top: .05rem;
        width: .3rem;
        height: .3rem;
        margin-right: .1rem;
      }
      span {
        position: relative;
        top: -.04rem;
      }
    }
    .moreVideos {
      padding-left: .3rem;
    }
    .otherPage {
      padding-right: .3rem;
    }
    .verticalLine {
      display: inline-block;
      margin-top: .1rem;
      width: .01rem;
      height: .2rem;
      background-color: #E8E8E8;
    }
  }
}
</style>
