<template>
  <router-link v-if="singleRecommendVideo.videoId" class="recommend-video" :to="{name: 'Play', params: { videoBaseId: singleRecommendVideo.videoId}}">
    <div class="single-recommend-video">{{singleRecommendVideo.name}}</div>
    <img src="../../assets/indexChannel/homePlay.png" alt="">
  </router-link>
  <a v-else :href="singleRecommendVideo.url" class="recommend-video">
    <div class="single-recommend-video">{{singleRecommendVideo.name}}</div>
    <img src="../../assets/indexChannel/homePlay.png" alt="">
  </a>
</template>
<script>
export default {
    name: 'recommend-video',
    props: ['singleRecommendVideo'],
    created() {
    }
};
</script>
<style scoped>

.recommend-video {
  display: block;
  width: 3.55rem;
  height: .22rem;
  line-height: .22rem;
  padding-left: .1rem;
  padding-right: .05rem;
  margin: .02rem 0;
  img {
    width: .22rem;
    height: .22rem;
    float: right;
  }
}

.single-recommend-video {
  width: 3.18rem;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  color: #666;
}
</style>
