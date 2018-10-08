<template>
  <section class="videolist-container" :class="{ mt50: hasResult}">
    <h2 v-if="!hasResult">热门推荐</h2>
    <ul class="video-list">
      <li class="video-item" v-for="item in videos">
        <div class="video-card">
          <div class="video-poster">
            <router-link v-if="item.platforms.indexOf(0) >= 0" :to="{ name: 'Play', params: { videoBaseId: item.videoBaseId }}">
              <span v-for="image in item.images">
                <img v-if="image.scale === 3" :src="image.url">
              </span>
            </router-link>
            <a v-else-if="item.detailCardVos.length > 0" :href="item.detailCardVos[0].sourceUrl">
              <span v-for="image in item.images">
                <img v-if="image.scale === 3" :src="image.url">
              </span>
            </a>
          </div>
          <div class="video-info">
            <h3>{{ item.name }}</h3>
            <p>年代：{{ item.yearLabelName }}</p>
            <p class="actor">演员：{{ item.actor }}</p>
            <p class="summary" style="-webkit-box-orient: vertical;">简介：{{ item.intro }}</p>
            <p class="source">
              <span>播放源：</span>
              <img v-if="item.platforms[0] === 0" src="../../assets/platform/youxiang.png">
              <img v-if="item.platforms[0] === 1" src="../../assets/platform/leshi.svg">
              <img v-if="item.platforms[0] === 2" src="../../assets/platform/tencent.png">
              <img v-if="item.platforms[0] === 3" src="../../assets/platform/qiy.svg">
              <img v-if="item.platforms[0] === 4" src="../../assets/platform/youku.png">
              <img v-if="item.platforms[0] === 5" src="../../assets/platform/souhu.png">
              <img v-if="item.platforms[0] === 6" src="../../assets/platform/acfun.png">
              <img v-if="item.platforms[0] === 7" src="../../assets/platform/sina.png">
              <img v-if="item.platforms[0] === 8" src="../../assets/platform/tudou.png">
              <img v-if="item.platforms[0] === 9" src="../../assets/platform/bilibili.png">
              <img v-if="item.platforms[0] === 10" src="../../assets/platform/acfun.png">
              <img v-if="item.platforms[0] === 11" src="../../assets/platform/mgtv.png">
              <img v-if="item.platforms[0] === 12" src="../../assets/platform/pptv.png">
              <img v-if="item.platforms[0] === 13" src="../../assets/platform/huashu.png">
              <img v-if="item.platforms[0] === 99" src="../../assets/platform/others.png">
            </p>
            <button class="play">
              <router-link v-if="item.platforms.indexOf(0) >= 0" :to="{ name: 'Play', params: { videoBaseId: item.videoBaseId }}">
                <img src="../../assets/search/play.svg" />立即播放
              </router-link>
              <a v-else :href="item.detailCardVos[0].sourceUrl">
                <img src="../../assets/search/play.svg" />立即播放
              </a>
            </button>
          </div>
        </div>
        <ul class="episode-list" v-if="item.categories === 2">
          <li v-if="item.platforms.indexOf(0) >= 0" v-for="episode in item.detailCardVos" :class="{ 'time-item': item.bizType === 2 }">
            <router-link :to="{ name: 'Play', params: { videoBaseId: item.videoBaseId }, query: { videoDetailId: episode.videoDetailId }}">
              <p v-if="item.bizType === 1">{{ episode.episode }}</p>
              <p v-else class="episode-item" style="-webkit-box-orient: vertical;">{{ episode.episodeDisplay }} {{ episode.title }}</p>
            </router-link>
          </li>
          <li v-if="item.platforms.indexOf(0) === -1" v-for="episode in item.detailCardVos" :class="{ 'time-item': item.bizType === 2 }">
            <a :href="episode.sourceUrl">
              <p v-if="item.bizType === 1">{{ episode.episode }}</p>
              <p v-else class="episode-item" style="-webkit-box-orient: vertical;">{{ episode.episodeDisplay }} {{ episode.title }}</p>
            </a>
          </li>
          <li class="check-more" v-if="item.bizType === 2 && item.showCheckMore && item.platforms.indexOf(0) >= 0">
            <router-link :to="{ name: 'Play', params: { videoBaseId: item.videoBaseId }, query: { videoDetailId: checkMoreVideoId }}">
              查看更多 >
            </router-link>
          </li>
          <li class="check-more" v-if="item.bizType === 2 && item.showCheckMore && item.platforms.indexOf(0) === -1">
              <a :href="item.detailCardVos[0].sourceUrl">查看更多 ></a>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
    name: 'videolist',
    props: ['videolist', 'hasResult'],
    data () {
        return {
            checkMoreVideoId: null,
        };
    },
    computed: {
        videos () {
            this.videolist.map((item, index) => {
                if (item.detailCardVos.length === 0) {
                    this.videolist.splice(index, 1);
                } else if (item.detailCardVos.length > 12) {
          // 多剧集默认显示两行
                    const data = item.detailCardVos;
                    const a = data.slice(0, 5);
                    const b = data.slice(-6);
                    const c = {
                        episode: '...',
                        title: data[0].title,
                        duration: data[0].duration,
                        sourceUrl: data[0].sourceUrl,
                        episodeDisplay: data[0].episodeDisplay,
                        videoDetailId: data[0].videoDetailId
                    };
                    item.detailCardVos = a.concat(c).concat(b);
                }
                if (item.bizType === 2 && item.detailCardVos.length > 3) {
          // 综艺剧集卡片条默认显示三条
                    item.detailCardVos = item.detailCardVos.slice(0, 3);
                    item.showCheckMore = true;
                    this.checkMoreVideoId = item.detailCardVos[0].videoDetailId;
                } else {
                    item.showCheckMore = false;
                }
            });
            return this.videolist;
        }
    }
};
</script>

<style scoped>
.mt50 {
  margin-top: .5rem;
}

.videolist-container {
  background: #FFF;
  h2 {
    padding: .14rem 0;
    margin-left: .14rem;
    font-size: .14rem;
    font-weight: normal;
    color: #111;
    border-bottom: .01rem solid #E6E6E6;
  }
  .video-card {
    overflow: hidden;
    clear: both;
    padding: .14rem 0 .14rem .16rem;
  }
}

.video-item {
  border-bottom: .01rem solid #E6E6E6;
}

.video-poster {
  float: left;
  display: inline-block;
  width: 1.05rem;
  height: 1.58rem;
  background: #CCC;
  img {
    width: 1.05rem;
    height: 1.58rem;
    border-radius: .04rem; /*  搜索页图片圆角  */
  }
}

.video-info {
  float: left;
  display: inline-block;
  position: relative;
  width: 2.18rem;
  height: 1.58rem;
  margin-left: .09rem;
  h3 {
    padding: .02rem 0;
    font-size: .14rem;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  p {
    font-size: .12rem;
    line-height: 1.5;
    color: #9D9D9D;
  }
  .actor {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .play {
    position: absolute;
    bottom: 0;
    height: .32rem;
    line-height: .32rem;
    padding: 0 .12rem;
    font-size: .13rem;
    text-align: center;
    color: #FFF;
    background: #FABE00;
    outline: none;
    border: none;
    border-radius: 4px;
    img {
      width: .1rem;
      height: .11rem;
      padding-right: .04rem;
      vertical-align: baseline;
    }
    a {
      display: inline-block;
      width: 100%;
      height: .32rem;
    }
  }
  .play:active {
    background: #EDB400;
  }
}

.summary {
  width: 2.18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}

.source {
  padding: .07rem 0;
  img {
    width: .15rem;
    vertical-align: middle;
  }
}

.episode-list {
  padding: 0 .16rem .12rem;
  li {
    display: inline-block;
    width: .53rem;
    height: .53rem;
    margin: 0 .04rem .04rem 0;
    text-align: center;
    background: #F2F3F6;
    border-radius: 6px;
    a {
      line-height: 1.2;
      display: block;
      position: relative;
      top: 52%;
      transform: translateY(-50%);
    }
  }
  .time-item {
    width: 3.33rem;
    height: .45rem;
    padding-left: .1rem;
    margin-bottom: .06rem;
    text-align: left;
    color: #272727;
  }
  .check-more {
    width: 3.43rem;
    height: .45rem;
    line-height: .45rem;
    margin: 0 auto;
    text-align: center;
    color: #FABE00;
    background: #F4F4F4;
    border-radius: .06rem;
  }
}

.episode-item {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}
</style>
