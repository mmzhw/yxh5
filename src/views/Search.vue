<template>
  <section class="search">
    <Search :showList="showSuggest" />
    <section class="no-result" v-if="!hasResult">
      <img src="../assets/search/noMovie.svg">
      <p>暂时没有相关影片哦</p>
    </section>
    <Videolist v-if="showVideolist" :videolist="videolist" :hasResult="hasResult" />
  </section>
</template>

<script>
import Search from '../components/search/Search.vue';
import Videolist from '../components/videoList/VideoList.vue';
import { imageUrl } from '../util/index.js';
import { wxShare } from '../util/wxShare.js';

export default {
    name: 'header',
    components: {
        Videolist,
        Search,
    },
    data () {
        return {
            keyword: '',
            videolist: [],
            hasResult: true,
            showVideolist: false,
            isShowSuggest: false,
            showSuggest: true
        };
    },
    created () {
    // 获取地址栏中关键词，请求数据
        this.keyword = this.$route.query.keyword;
        this.getVideoData(this.keyword, 10);
    },
    mounted () {
        let defaultShare = 'https://image.youxiang0210.com/wechat-share.png';
        wxShare('有象视频', '看剧追片，有象就够', defaultShare);
    },
    watch: {
        '$route.query.keyword': function () {
            this.getVideoData(this.$route.query.keyword, 10);
        },
    },
    methods: {
        formatImageUrl (imageData) {
            const filterImageData = imageData.filter(item => item.status === 2);
            filterImageData.forEach((item, index) => {
                item.images && item.images.forEach((item1, index1) => {
                    if (item.images[index1].url.indexOf('http') === -1) {
                        item.images[index1].url = imageUrl + item.images[index1].url;
                    }
                });
            });
            return filterImageData;
        },
        getVideoData (keyword, pageSize) {
      // 根据关键词搜索
            this.axios.post('/m_web/search/selectQueryWord', { word: keyword, pageSize: pageSize })
      .then(res => {
          if (res.code === 0) {
              this.showVideolist = true;
              if (res.data.records) {
            // 搜索结果不为空
                  this.videolist = this.formatImageUrl(res.data.videos);
                  this.hasResult = true;
              } else {
            // 搜索结果为空 —— 获取热门推荐列表
                  this.getHotSearch(10);
                  this.hasResult = false;
              }
              this.showSuggest = false;
          }
      }).catch(err => console.error(err));
        },
        search () {
            if (!this.keyword.trim()) { return; }
            this.getVideoData(this.keyword, 10);
        },
        getHotSearch (pageSize) {
      // 获取热门推荐列表
            this.axios.post('/m_web/search/hotSearch', { pageSize })
      .then(res => {
          if (res.code === 0) {
              this.videolist = this.formatImageUrl(res.data.videos);
              this.hasResult = false;
          }
      }).catch(err => console.error(err));
        },
    }
};
</script>

<style scoped>
.no-result {
  height: 1.9rem;
  margin-top: .5rem;
  text-align: center;
  background: #F4F4F4;
  img {
    margin-top: .5rem;
    width: .587rem;
    height: .447rem;
  }
  p {
    margin-top: .185rem;
    font-size: .16rem;
    color: #AAA;
  }
}

.check-all {
  width: 3.43rem;
  height: .45rem;
  line-height: .45rem;
  margin: .06rem auto;
  text-align: center;
  color: #FABE00;
  background: #F4F4F4;
  border-radius: .06rem;
}
</style>
